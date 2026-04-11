export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": "https://www.eldomiaty-clinic.com/#clinic",
        name: "عيادة دكتور محمد الدمياطي للنساء والتوليد",
        url: "https://www.eldomiaty-clinic.com",
        telephone: "+201066746007",
        email: "m.a.eldomiaty@gmail.com",
        description:
          "عيادة متخصصة في أمراض النساء والتوليد والحقن المجهرى والمناظير بالقاهرة",
        medicalSpecialty: "Obstetrics and Gynecology",
        address: [
          {
            "@type": "PostalAddress",
            addressLocality: "التجمع الخامس",
            addressRegion: "القاهرة",
            addressCountry: "EG",
            streetAddress:
              "كايرو ميديكال سنتر خلف المستشفى الجوى - شارع التسعين الشمالى",
          },
          {
            "@type": "PostalAddress",
            addressLocality: "المهندسين",
            addressRegion: "القاهرة",
            addressCountry: "EG",
            streetAddress: "43 شارع سوريا بجوار لابور",
          },
          {
            "@type": "PostalAddress",
            addressLocality: "مدينة نصر",
            addressRegion: "القاهرة",
            addressCountry: "EG",
            streetAddress: "40 شارع عباس العقاد أمام كوستا كافية",
          },
          {
            "@type": "PostalAddress",
            addressLocality: "مدينتى",
            addressRegion: "القاهرة",
            addressCountry: "EG",
            streetAddress: "ميديكال سنتر 1 مدينتى",
          },
        ],
        sameAs: [
          "https://www.facebook.com/EldomiatyClinic/",
          "https://www.instagram.com/eldomiatyclinic/",
          "https://www.youtube.com/channel/UCd-XnwyMN1DOcPkfruFoHJQ",
        ],
        hasMap:
          "https://www.google.com/maps?q=Eldomiaty+Clinic+Dr+Mohamed+Eldomiaty",
        availableService: [
          { "@type": "MedicalTherapy", name: "الحقن المجهرى" },
          { "@type": "MedicalTherapy", name: "ولادة بدون ألم" },
          { "@type": "MedicalTherapy", name: "أطفال الأنابيب" },
          { "@type": "MedicalTherapy", name: "منظار الرحم" },
          { "@type": "MedicalTherapy", name: "منظار البطن" },
          { "@type": "MedicalTherapy", name: "متابعة الحمل" },
        ],
      },
      {
        "@type": "Physician",
        "@id": "https://www.eldomiaty-clinic.com/#doctor",
        name: "د. محمد الدمياطي",
        url: "https://www.eldomiaty-clinic.com",
        telephone: "+201066746007",
        medicalSpecialty: "Obstetrics and Gynecology",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "كلية طب القصر العينى - جامعة القاهرة",
        },
        memberOf: [
          {
            "@type": "MedicalOrganization",
            name: "Royal College of Obstetricians and Gynaecologists",
          },
          {
            "@type": "MedicalOrganization",
            name: "American Society for Reproductive Medicine",
          },
        ],
        worksFor: { "@id": "https://www.eldomiaty-clinic.com/#clinic" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
