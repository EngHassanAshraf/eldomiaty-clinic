import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadGatewayException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

const FILE_PUBLIC_SELECT = {
  id: true,
  title: true,
  description: true,
  isPaidContent: true,
  createdAt: true,
  fileUrl: false,
};

@Injectable()
export class FilesService {
  private supabase: SupabaseClient;
  private bucket: string;
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
    this.bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'clinic-files';
  }

  async upload(
    file: Express.Multer.File,
    dto: CreateFileDto,
    uploaderId: string,
  ) {
    const storagePath = `${uuidv4()}-${file.originalname}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(storagePath, file.buffer, { contentType: file.mimetype });

    if (error) {
      this.logger.error('Supabase upload failed', error);
      throw new BadGatewayException('File upload failed');
    }

    const record = await this.prisma.file.create({
      data: {
        title: dto.title,
        description: dto.description,
        fileUrl: storagePath,
        isPaidContent: dto.isPaidContent,
        uploadedBy: uploaderId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        isPaidContent: true,
        createdAt: true,
      },
    });

    return record;
  }

  async findAll() {
    return this.prisma.file.findMany({
      select: FILE_PUBLIC_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: { isPaid: boolean }) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    const expiry = user.isPaid ? 3600 : 60;
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(file.fileUrl, expiry);

    if (error || !data?.signedUrl) {
      throw new BadGatewayException('Could not generate file URL');
    }

    return {
      id: file.id,
      title: file.title,
      description: file.description,
      isPaidContent: file.isPaidContent,
      url: data.signedUrl,
    };
  }

  async getPreview(id: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(file.fileUrl, 60);

    if (error || !data?.signedUrl) {
      throw new BadGatewayException('Could not generate preview URL');
    }

    return { url: data.signedUrl };
  }

  async getFullAccess(id: string, user: { isPaid: boolean }) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    if (!user.isPaid) {
      throw new ForbiddenException('Full access requires a paid subscription');
    }

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(file.fileUrl, 3600);

    if (error || !data?.signedUrl) {
      throw new BadGatewayException('Could not generate full-access URL');
    }

    return { url: data.signedUrl };
  }

  async update(id: string, dto: UpdateFileDto) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    return this.prisma.file.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        title: true,
        description: true,
        isPaidContent: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException(`File ${id} not found`);

    await this.supabase.storage.from(this.bucket).remove([file.fileUrl]);
    await this.prisma.file.delete({ where: { id } });

    return { message: 'File deleted successfully' };
  }
}
