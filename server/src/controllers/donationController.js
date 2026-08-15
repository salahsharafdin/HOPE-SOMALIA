const { prisma } = require('../config');
const { donationSchema } = require('../validators');
const paymentService = require('../utils/payment');
const { createAuditLog } = require('../utils/auditLogger');

exports.createDonation = async (req, res, next) => {
  try {
    const data = donationSchema.parse(req.body);

    // Process via abstracted payment service
    const paymentResult = await paymentService.processPayment({
      amount: data.amount,
      currency: data.currency,
      donorEmail: data.donorEmail,
      paymentMethod: data.paymentMethod,
    });

    const donation = await prisma.donation.create({
      data: {
        ...data,
        status: paymentResult.status,
        transactionId: paymentResult.transactionId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllDonations = async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { donorName: { contains: search } },
        { donorEmail: { contains: search } },
        { transactionId: { contains: search } },
      ];
    }

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalAmount = donations.reduce((acc, curr) => (curr.status === 'Paid' ? acc + curr.amount : acc), 0);

    res.json({
      success: true,
      count: donations.length,
      totalAmount,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const donation = await prisma.donation.update({
      where: { id },
      data: { status },
    });

    await createAuditLog({
      user: req.user,
      action: 'UPDATE_DONATION_STATUS',
      resource: 'Donation',
      resourceId: donation.id,
      details: `Updated donation status for ${donation.donorName} ($${donation.amount}) to ${status}`,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Donation status updated', data: donation });
  } catch (error) {
    next(error);
  }
};
