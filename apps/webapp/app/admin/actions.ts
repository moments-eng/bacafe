'use server';
import { UserModel } from '@/lib/models/user.model';

export async function getAdminStats() {
	const now = new Date();
	const todayStart = new Date(now.setHours(0, 0, 0, 0));
	const todayEnd = new Date(now.setHours(23, 59, 59, 999));

	const [totalUsers, pendingApprovals, newUsersToday, signupTrend] =
		await Promise.all([
			UserModel.countDocuments(),
			UserModel.countDocuments({ approved: false }),
			UserModel.countDocuments({
				createdAt: { $gte: todayStart, $lte: todayEnd },
			}),
			UserModel.aggregate([
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: -1 } },
				{ $limit: 7 },
			]),
		]);

	const digestPerformance: any[] = []; // Placeholder for digest stats

	return {
		totalUsers,
		pendingApprovals,
		newUsersToday,
		newUsersTrend: 0, // Calculate based on previous day
		signupTrend: signupTrend.reverse().map((item) => ({
			date: item._id,
			signups: item.count,
		})),
		digestPerformance,
	};
}
