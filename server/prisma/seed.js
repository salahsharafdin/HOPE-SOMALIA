const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Hope Somalia Foundation...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.news.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.program.deleteMany();
  await prisma.story.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.document.deleteMany();
  await prisma.media.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned database.');

  // 2. Create Users
  const superAdminPassword = await bcrypt.hash('Admin123!', 10);
  const staffPassword = await bcrypt.hash('Staff123!', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@hopesomalia.org',
      passwordHash: superAdminPassword,
      fullName: 'Dr. Abdirahman Hassan',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const contentManager = await prisma.user.create({
    data: {
      email: 'editor@hopesomalia.org',
      passwordHash: staffPassword,
      fullName: 'Fatima Omar',
      role: 'CONTENT_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  });

  await prisma.user.create({
    data: {
      email: 'finance@hopesomalia.org',
      passwordHash: staffPassword,
      fullName: 'Mohamed Jama',
      role: 'FINANCE_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('👤 Created administrative users.');

  // 3. Create Programs
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: 'Education & Child Empowerment',
        slug: 'education-child-empowerment',
        description: 'Supporting access to quality education, building modern schools, and providing learning resources for vulnerable children.',
        content: 'Our education programs focus on constructing safe learning facilities, training local educators, providing digital learning kits, and offering school feeding programs across displaced person camps and rural villages.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Construct 25 community schools\nProvide scholarships for 10,000 children\nTrain 500 local teachers in child safeguarding',
        locations: 'Mogadishu, Baidoa, Kismayo, Garowe',
        beneficiaries: '35,000+ Children',
        status: 'Active',
        order: 1,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Healthcare & Maternal Survival',
        slug: 'healthcare-maternal-survival',
        description: 'Improving access to essential healthcare, mobile clinics, maternal emergency wards, and malnutrition treatment.',
        content: 'We operate mobile medical teams and equip primary health facilities in underserved regions, cutting child mortality rates and providing lifesaving maternal emergency interventions.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Deploy 12 mobile health vans\nTreat 50,000 acute malnutrition cases annually\nSupport 15,000 safe births with midwife assistance',
        locations: 'Baidoa, Mogadishu, Beledweyne',
        beneficiaries: '65,000+ Patients',
        status: 'Active',
        order: 2,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Clean Water & Sanitation (WASH)',
        slug: 'clean-water-sanitation',
        description: 'Providing sustainable access to safe drinking water through solar-powered boreholes and hygiene education.',
        content: 'Water scarcity is a key driver of crisis. We drill deep solar-powered boreholes, install water purification stations, and build hygiene facilities to stop waterborne disease outbreaks.',
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Build 40 deep solar boreholes\nEstablish 100 community water committees\nDeliver hygiene kits to 20,000 IDP families',
        locations: 'Lower Shabelle, Bay Region, Mudug',
        beneficiaries: '85,000+ Villagers',
        status: 'Active',
        order: 3,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Food Security & Sustainable Livelihoods',
        slug: 'food-security-livelihoods',
        description: 'Supporting vulnerable families with climate-resilient farming seeds, livestock support, and micro-entrepreneurship.',
        content: 'Breaking dependency on emergency aid through climate-adapted agricultural technology, drip irrigation, livestock vaccination, and seed distributions.',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Support 5,000 smallholder farming families\nDistribute drought-resistant crop seeds\nTrain 1,200 women in climate-smart agriculture',
        locations: 'Jubaland, Hirshabelle, Galmudug',
        beneficiaries: '40,000+ Farmers & Families',
        status: 'Active',
        order: 4,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Women & Youth Empowerment',
        slug: 'women-youth-empowerment',
        description: 'Empowering women and young people through vocational skills, financial literacy, and micro-grant seed funding.',
        content: 'Creating sustainable livelihoods through vocational training centres, tailoring hubs, solar technician courses, and business micro-loans.',
        image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Graduate 2,500 youth from vocational institutes\nProvide seed funding for 500 women-led micro-enterprises\nEstablish 5 community innovation hubs',
        locations: 'Mogadishu, Hargeisa, Kismayo',
        beneficiaries: '15,000+ Youth & Women',
        status: 'Active',
        order: 5,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Emergency Response & Humanitarian Aid',
        slug: 'emergency-response-aid',
        description: 'Providing rapid humanitarian assistance, shelter, and emergency food rations during climate and conflict crises.',
        content: 'When emergency strikes, our rapid deployment team arrives within 48 hours to deliver emergency nutrition packs, clean water trucks, plastic sheeting shelter, and essential cash relief.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        objectives: 'Maintain 48-hour emergency response capability\nDistribute cash transfers to 10,000 displaced families\nConstruct emergency shelters for 4,000 households',
        locations: 'Nationwide Emergency Zones',
        beneficiaries: '100,000+ Crisis Survivors',
        status: 'Active',
        order: 6,
      },
    }),
  ]);

  console.log('📌 Created 6 core NGO programs.');

  // 4. Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Solar Water Borehole & Purification Station',
      slug: 'solar-water-borehole-baidoa',
      description: 'Construction of a 180-meter solar-powered borehole supplying clean drinking water to over 14,000 residents in Baidoa rural settlements.',
      content: 'This flagship WASH project addresses severe water scarcity in drought-affected communities around Baidoa. Utilizing 48 high-efficiency solar panels and a 50,000-liter elevated storage tank, the station eliminates waterborne diseases and removes the need for women and children to walk hours to unsafe wells.',
      featuredImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
      programId: programs[2].id,
      location: 'Baidoa District',
      region: 'Bay Region',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-09-30'),
      budget: 85000,
      beneficiaries: 14200,
      progress: 90,
      status: 'Active',
      isFeatured: true,
      objectives: '1. Drill 180m hydro-geological borehole\n2. Install 50,000L elevated water tank\n3. Construct 8 distribution water kiosks\n4. Form democratic water management committee',
      results: 'Over 14,000 community members now have daily access to lab-tested clean water within 200 meters of their homes. Diarrheal infections dropped by 76%.',
      impact: 'Dramatically improved child health, increased school attendance, and eliminated water-seeking labor for over 2,500 women.',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80', caption: 'Solar panel installation at main pumping site' },
          { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80', caption: 'Community members accessing clean water at distribution kiosk' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mogadihu Maternal Emergency & Child Survival Clinic',
      slug: 'mogadishu-maternal-child-clinic',
      description: 'Fully equipped 24/7 maternity clinic providing emergency obstetric care, newborn resuscitation, and malnutrition stabilization.',
      content: 'Located in Daynile district, this healthcare facility operates round-the-clock. It features an emergency delivery suite, pediatric triage ward, pharmacy, and a mobile ambulance unit.',
      featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      programId: programs[1].id,
      location: 'Daynile, Mogadishu',
      region: 'Banaadir',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2026-06-01'),
      budget: 140000,
      beneficiaries: 28000,
      progress: 100,
      status: 'Completed',
      isFeatured: true,
      objectives: '1. Establish 24/7 maternal emergency ward\n2. Hire 14 certified midwives and pediatric nurses\n3. Provide free prenatal and postnatal vitamins and treatments',
      results: 'Successfully assisted 3,400 safe births with zero maternal deaths in the facility during 2025.',
      impact: 'Serves as a safe sanctuary for expectant mothers across 6 IDP camps.',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Kismayo Youth Vocational & Digital Learning Center',
      slug: 'kismayo-youth-digital-center',
      description: 'Empowering 600 young men and women with certified skills in solar energy installation, computer literacy, and business management.',
      content: 'A state-of-the-art vocational center equipped with 40 computer workstations, solar practical labs, and tailoring workshops.',
      featuredImage: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80',
      programId: programs[4].id,
      location: 'Kismayo',
      region: 'Jubaland',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-12-31'),
      budget: 95000,
      beneficiaries: 600,
      progress: 65,
      status: 'Active',
      isFeatured: true,
      objectives: '1. Graduate 600 certified youth\n2. Provide micro-grant toolkits for top graduates\n3. Connect graduates with regional employers',
      results: 'First cohort of 200 solar technicians graduated with 88% employment rate within 60 days.',
      impact: 'Creating viable economic alternatives to youth migration and unemployment.',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      title: 'Flood Emergency Relief & Cash Transfers',
      slug: 'hirshabelle-flood-relief',
      description: 'Emergency cash aid, hygiene kits, and temporary plastic sheeting shelter for 4,500 flood-affected families in Beledweyne.',
      content: 'Rapid emergency intervention delivering unconditional monthly cash transfers via mobile money directly to affected heads of households.',
      featuredImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      programId: programs[5].id,
      location: 'Beledweyne',
      region: 'Hirshabelle',
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-11-15'),
      budget: 120000,
      beneficiaries: 22500,
      progress: 100,
      status: 'Completed',
      isFeatured: false,
      objectives: '1. Distribute $100 emergency cash transfers to 4,500 households\n2. Deliver 4,500 clean water purification kits',
      results: 'Direct cash assistance reached families within 72 hours of flood warning.',
      impact: 'Prevented starvation and enabled families to rebuild damaged homes independently.',
    },
  });

  console.log('🏗️ Created 4 detailed projects with images.');

  // 5. Create Categories & News Articles
  const catHumanitarian = await prisma.category.create({ data: { name: 'Humanitarian Updates', slug: 'humanitarian-updates' } });
  const catImpact = await prisma.category.create({ data: { name: 'Impact Stories', slug: 'impact-stories' } });
  const catReports = await prisma.category.create({ data: { name: 'Press Release', slug: 'press-release' } });

  await prisma.news.create({
    data: {
      title: 'Hope Somalia Launches Major Solar Water Infrastructure Project in Baidoa',
      slug: 'hope-somalia-launches-solar-water-baidoa',
      excerpt: 'Over 14,000 residents in drought-affected Baidoa settlements gain sustainable access to clean drinking water through our new solar borehole installation.',
      content: `
        <p>In response to persistent drought conditions across the Bay region, Hope Somalia Foundation has officially commissioned a major 180-meter solar-powered water system in Baidoa.</p>
        <h3>Transforming Access to Clean Water</h3>
        <p>The facility features 48 high-output monocrystalline solar panels driving a heavy-duty submersible pump capable of yielding over 120,000 liters of potable water daily. The system pumps water directly into an elevated 50,000-liter storage reservoir, feeding 8 clean water kiosks positioned strategically near IDP settlements.</p>
        <blockquote class="border-l-4 border-emerald-600 pl-4 my-4 italic text-slate-700">"For years, our children suffered from cholera and dysentery because we had no choice but to drink stagnant flood water. Today, clean water flows right near our doorstep." — Habiba Nur, Community Leader</blockquote>
        <h3>Community Ownership & Governance</h3>
        <p>To ensure long-term sustainability, Hope Somalia trained a 10-member gender-balanced water management committee responsible for routine maintenance, security, and tariff management for commercial users while keeping domestic supply completely free for vulnerable households.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
      categoryId: catHumanitarian.id,
      tags: 'Water, Baidoa, Climate Action, Solar',
      status: 'Published',
      publishedAt: new Date('2025-08-10'),
      seoTitle: 'Solar Water Infrastructure Project in Baidoa | Hope Somalia',
      seoDescription: 'Hope Somalia Foundation commissions 180m solar water borehole serving 14,000 residents in Baidoa, Somalia.',
      isFeatured: true,
    },
  });

  await prisma.news.create({
    data: {
      title: 'Annual Impact Report 2025: Reaching Over 150,000 Lives Across Somalia',
      slug: 'annual-impact-report-2025-release',
      excerpt: 'Our 2025 audited financial and operational report highlights major milestones in healthcare, education, clean water, and emergency response.',
      content: `
        <p>Hope Somalia Foundation is proud to publish our comprehensive 2025 Annual Impact Report. Thanks to generous global donors and institutional partners, our programs touched the lives of 154,200 individuals across 42 communities.</p>
        <h3>Key Accomplishments in 2025:</h3>
        <ul>
          <li><strong>14,200+ people</strong> gained permanent access to safe drinking water.</li>
          <li><strong>3,400 safe deliveries</strong> facilitated at our Daynile Maternity Clinic with zero maternal mortality.</li>
          <li><strong>600 young adults</strong> graduated with practical vocational certifications.</li>
          <li><strong>$450,000 USD</strong> disbursed directly in emergency humanitarian cash transfers.</li>
        </ul>
        <p>Transparency and financial accountability remain at the core of our operations. 88.4% of every dollar donated went directly into field programs.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      authorId: contentManager.id,
      categoryId: catReports.id,
      tags: 'Annual Report, Financial Transparency, Impact',
      status: 'Published',
      publishedAt: new Date('2025-08-01'),
      seoTitle: 'Annual Impact Report 2025 | Hope Somalia Foundation',
      seoDescription: 'Read the official 2025 Annual Impact & Financial Report of Hope Somalia Foundation.',
      isFeatured: true,
    },
  });

  console.log('📰 Created news articles & categories.');

  // 6. Create Stories of Change
  await prisma.story.create({
    data: {
      name: 'Amina Mohamed & Her Newborn Daughter',
      location: 'Daynile IDP Camp, Mogadishu',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      story: 'When Amina went into premature labor in the middle of a torrential storm, there were no transport vehicles in her camp. Hope Somalia’s free mobile ambulance dispatched immediately, bringing her to our Daynile Clinic where midwives safely delivered baby Leyla.',
      programName: 'Healthcare & Maternal Survival',
      impact: 'Safe emergency birth & full infant health recovery',
      isFeatured: true,
    },
  });

  await prisma.story.create({
    data: {
      name: 'Farhan Aden',
      location: 'Kismayo',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      story: 'After losing his livelihood during the severe drought, 22-year-old Farhan enrolled in our solar installation course. Today, he runs his own registered micro-enterprise installing rooftop solar kits for homes in Kismayo.',
      programName: 'Women & Youth Empowerment',
      impact: 'Earns $450/month and employs 3 youth apprentices',
      isFeatured: true,
    },
  });

  console.log('📖 Created stories of change.');

  // 7. Testimonials & Partners
  await prisma.testimonial.create({
    data: {
      quote: 'Hope Somalia Foundation is one of the most transparent, deeply rooted, and community-trusted organizations we have partnered with in the Horn of Africa.',
      authorName: 'Dr. Sarah Jenkins',
      authorTitle: 'Senior Humanitarian Advisor',
      organization: 'Global Relief Network',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.testimonial.create({
    data: {
      quote: 'Their rapid response team delivered clean water and emergency cash transfers to our village within two days of the river burst. They kept their promise.',
      authorName: 'Elder Dahir Warsame',
      authorTitle: 'Community Council Head',
      organization: 'Beledweyne Local Council',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
  });

  const partners = [
    { name: 'UNICEF Somalia', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=400&q=80', type: 'Institutional', websiteUrl: 'https://unicef.org' },
    { name: 'World Food Programme (WFP)', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80', type: 'Donor', websiteUrl: 'https://wfp.org' },
    { name: 'EU Civil Protection & Humanitarian Aid', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80', type: 'Institutional', websiteUrl: 'https://ec.europa.eu/echo' },
    { name: 'Somali Ministry of Humanitarian Affairs', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80', type: 'Strategic', websiteUrl: 'https://mohadma.gov.so' },
  ];

  for (const p of partners) {
    await prisma.partner.create({ data: p });
  }

  console.log('🤝 Created testimonials and strategic partners.');

  // 8. FAQs & Documents
  const faqs = [
    { question: 'Where does my donation go?', answer: '88.4% of all donations directly fund on-the-ground programs in Somalia including clean water wells, emergency healthcare, and school meals. 11.6% covers operational audit, security, and administration.', category: 'Donations', order: 1 },
    { question: 'Is Hope Somalia Foundation an officially registered NGO?', answer: 'Yes. Hope Somalia Foundation is officially registered with the Federal Ministry of Planning, Investment and Economic Development of Somalia (Registration No: NGO-SOM-2018-042).', category: 'General', order: 2 },
    { question: 'How can I volunteer with Hope Somalia?', answer: 'We accept local and international remote volunteers for positions in health, education, communications, research, and grant writing. Submit an application through our Volunteer portal.', category: 'Volunteering', order: 3 },
    { question: 'Can I sponsor a specific solar borehole or school?', answer: 'Yes! Donors or institutional sponsors can fully fund specific high-impact projects. We provide detailed quarterly progress, GPS coordinates, and donor plaques.', category: 'Donations', order: 4 },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }

  await prisma.document.create({
    data: {
      title: '2025 Audited Financial Statement',
      category: 'Financial Report',
      fileUrl: '/uploads/documents/Hope_Somalia_Financial_Audit_2025.pdf',
      fileSize: '2.4 MB',
      year: '2025',
      description: 'Independent audit report conducted by KPMG East Africa covering all income and field expenditures.',
    },
  });

  await prisma.document.create({
    data: {
      title: 'Child Safeguarding & Protection Policy 2026',
      category: 'Policy',
      fileUrl: '/uploads/documents/Hope_Somalia_Safeguarding_Policy_2026.pdf',
      fileSize: '1.1 MB',
      year: '2026',
      description: 'Mandatory code of conduct for all staff, contractors, and international partners working with vulnerable children.',
    },
  });

  console.log('📄 Created FAQs and official documents.');

  // 9. Initial Donations, Volunteers, and Contact Messages
  const donations = [
    { donorName: 'Global Giving Partner', donorEmail: 'donor@globalgiving.org', donorPhone: '+1-555-019-2834', amount: 5000, currency: 'USD', type: 'one-time', purpose: 'Clean Water Fund', status: 'Paid', transactionId: 'TXN-99482103', paymentMethod: 'Bank Transfer' },
    { donorName: 'Mohamud Ali', donorEmail: 'm.ali@example.com', donorPhone: '+252-615-554433', amount: 100, currency: 'USD', type: 'monthly', purpose: 'Education & Child Support', status: 'Paid', transactionId: 'TXN-88421092', paymentMethod: 'Card' },
    { donorName: 'Safia Warsame', donorEmail: 'safia.w@example.com', amount: 250, currency: 'USD', type: 'one-time', purpose: 'Healthcare & Maternal Survival', status: 'Paid', transactionId: 'TXN-77310941', paymentMethod: 'PayPal' },
    { donorName: 'Anonymous Supporter', donorEmail: 'anonymous@donor.org', amount: 50, currency: 'USD', type: 'monthly', purpose: 'General Emergency Fund', status: 'Paid', transactionId: 'TXN-66209830', paymentMethod: 'Card' },
  ];

  for (const d of donations) {
    await prisma.donation.create({ data: d });
  }

  await prisma.volunteer.create({
    data: {
      fullName: 'Hodane Ibrahim',
      email: 'hodan.ibrahim@example.com',
      phone: '+252-612-998877',
      country: 'Somalia',
      skills: 'Nursing, Maternal Care, First Aid',
      experience: '4 years staff nurse at Banadir Hospital',
      availability: 'Full-time',
      motivation: 'I wish to dedicate my nursing skills to helping mothers in remote IDP camps who lack emergency care.',
      status: 'Approved',
    },
  });

  await prisma.volunteer.create({
    data: {
      fullName: 'David Miller',
      email: 'david.m@example.org',
      phone: '+44-7911-123456',
      country: 'United Kingdom',
      skills: 'Grant Writing, Monitoring & Evaluation, Data Analysis',
      experience: '6 years humanitarian evaluator with Red Cross',
      availability: 'Remote',
      motivation: 'Want to assist Hope Somalia in drafting high-impact proposals for international climate funds.',
      status: 'Pending',
    },
  });

  await prisma.contactMessage.create({
    data: {
      name: 'Sahra Hassan',
      email: 'sahra.h@organization.org',
      phone: '+252-618-112233',
      subject: 'Partnership Inquiry for Clean Water in Lower Shabelle',
      message: 'Greetings Hope Somalia team. Our international foundation would like to explore co-funding 3 solar water boreholes in Lower Shabelle during Q4 2026. Please connect us with your project director.',
      isRead: false,
    },
  });

  console.log('💬 Created initial donations, volunteer applications, and contact messages.');

  // 10. Site Settings & Stats
  const defaultSettings = [
    { key: 'site_name', value: 'Hope Somalia Foundation' },
    { key: 'site_tagline', value: 'Creating Hope. Changing Lives. Building Stronger Communities.' },
    { key: 'contact_email', value: 'info@hopesomalia.org' },
    { key: 'contact_phone', value: '+252 61 500 0000 / +252 62 700 0000' },
    { key: 'contact_address', value: 'Km4 Airport Road, Hodan District, Mogadishu, Somalia' },
    { key: 'social_facebook', value: 'https://facebook.com/hopesomaliafoundation' },
    { key: 'social_twitter', value: 'https://x.com/hopesomalia' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/hopesomalia' },
    { key: 'social_instagram', value: 'https://instagram.com/hopesomalia' },
    { key: 'stat_people_reached', value: '154200' },
    { key: 'stat_projects_completed', value: '84' },
    { key: 'stat_communities_served', value: '42' },
    { key: 'stat_children_supported', value: '35000' },
    { key: 'hero_headline', value: 'Creating Hope. Changing Lives. Building Stronger Communities.' },
    { key: 'hero_description', value: 'We work directly with communities to create sustainable solutions in education, healthcare, clean water, livelihoods, and rapid emergency response.' },
    { key: 'hero_image', value: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.create({
      data: {
        id: `set_${s.key}`,
        key: s.key,
        value: s.value,
      },
    });
  }

  console.log('⚙️ Configured global organization settings.');
  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
