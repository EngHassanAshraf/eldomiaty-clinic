import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      { apiVersion: '2023-10-16' },
    );
  }

  async createCheckoutSession(userId: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
        metadata: { userId },
        line_items: [
          {
            price: this.configService.get<string>('STRIPE_PRICE_ID'),
            quantity: 1,
          },
        ],
      });

      return { url: session.url };
    } catch (error) {
      this.logger.error('Stripe checkout session creation failed', error);
      throw new BadGatewayException('Payment service unavailable');
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      this.logger.warn(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        this.logger.warn('Webhook: missing userId in session metadata');
        return { received: true };
      }

      await this.prisma.payment.create({
        data: {
          userId,
          stripeSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: session.payment_status,
        },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: { isPaid: true },
      });

      this.logger.log(`Payment completed for user ${userId}`);
    }

    return { received: true };
  }

  async findAll() {
    return this.prisma.payment.findMany({
      select: {
        id: true,
        userId: true,
        stripeSessionId: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
