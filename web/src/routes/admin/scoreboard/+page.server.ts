import { db } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { scoreboardData } from '$lib/server/scoreboardData';

export const load = (async ({ cookies }) => {
	const selectedContestIdStr = cookies.get('selectedContest');
	const selectedContestId =
		selectedContestIdStr === undefined ? null : parseInt(selectedContestIdStr);

	if (selectedContestId !== null) {
		const contest = await db.contest.findUnique({
			where: { id: selectedContestId },
			include: { problems: true, teams: { include: { submissions: true } } }
		});
		if (contest === null) {
			throw redirect(302, '/admin/scoreboard');
		}
		return scoreboardData(contest);
	} else {
		return {
			timestamp: new Date(),
			contest: null
		};
	}
}) satisfies PageServerLoad;
