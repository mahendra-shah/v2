/**
 * Data service for fetching and formatting user data for the AI chatbot
 * Fetches FULL YEAR data for comprehensive AI responses
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get authorization headers
 */
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
});

/**
 * Fetch user's activity logs for a given month/year
 */
export const fetchUserActivities = async (month, year) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/activityLogs?month=${String(month).padStart(2, '0')}&year=${year}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        const data = await response.json();
        return data.data || {};
    } catch (error) {
        console.error('Error fetching activities:', error);
        return {};
    }
};

/**
 * Fetch user's activity logs for the ENTIRE YEAR
 */
export const fetchYearActivities = async (year, email) => {
    const currentMonth = new Date().getMonth() + 1;
    const monthsToFetch = [];

    // Fetch from January to current month
    for (let m = 1; m <= currentMonth; m++) {
        monthsToFetch.push(m);
    }

    try {
        const results = await Promise.all(
            monthsToFetch.map((month) => fetchUserActivities(month, year))
        );

        // Merge all months' activities
        const allActivities = [];
        results.forEach((monthData) => {
            const userActivities = monthData[email] || [];
            allActivities.push(...userActivities);
        });

        return allActivities;
    } catch (error) {
        console.error('Error fetching year activities:', error);
        return [];
    }
};

/**
 * Fetch user's leave records
 */
export const fetchUserLeaves = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/leave-records`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaves');
        }

        const data = await response.json();
        return data || {};
    } catch (error) {
        console.error('Error fetching leaves:', error);
        return {};
    }
};

/**
 * Fetch user's leave policy (balances)
 */
export const fetchLeavePolicy = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/employmentLeavePolicy`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leave policy');
        }

        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching leave policy:', error);
        return [];
    }
};

/**
 * Fetch payroll/cycle summary
 */
export const fetchPayrollSummary = async (year, month) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/payableDaysCalculation?year=${year}&month=${month}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch payroll data');
        }

        const result = await response.json();
        return result?.data?.[0] || null;
    } catch (error) {
        console.error('Error fetching payroll:', error);
        return null;
    }
};

/**
 * Get current period info
 */
const getCurrentPeriod = () => {
    const now = new Date();
    return {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        monthName: now.toLocaleString('default', { month: 'long' }),
    };
};

/**
 * Calculate activity statistics for the WHOLE YEAR
 */
const calculateYearActivityStats = (activities) => {
    if (!activities || activities.length === 0) {
        return null;
    }

    const totalHours = activities.reduce(
        (sum, act) => sum + Number(act.totalHoursSpent || 0),
        0
    );

    // Group by project
    const projectHours = {};
    activities.forEach((act) => {
        const project = act.projectName || 'Unknown';
        projectHours[project] = (projectHours[project] || 0) + Number(act.totalHoursSpent || 0);
    });

    // Sort projects by hours
    const sortedProjects = Object.entries(projectHours)
        .sort((a, b) => b[1] - a[1])
        .map(([name, hours]) => ({ name, hours }));

    // Group by month
    const monthlyHours = {};
    activities.forEach((act) => {
        if (act.entryDate) {
            const month = act.entryDate.substring(0, 7); // YYYY-MM format
            monthlyHours[month] = (monthlyHours[month] || 0) + Number(act.totalHoursSpent || 0);
        }
    });

    // Find most active day
    const dayHours = {};
    activities.forEach((act) => {
        const date = act.entryDate;
        dayHours[date] = (dayHours[date] || 0) + Number(act.totalHoursSpent || 0);
    });

    const mostActiveDay = Object.entries(dayHours)
        .sort((a, b) => b[1] - a[1])[0];

    // Current month stats
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentMonthActivities = activities.filter(
        (act) => act.entryDate && act.entryDate.startsWith(currentMonth)
    );
    const currentMonthHours = currentMonthActivities.reduce(
        (sum, act) => sum + Number(act.totalHoursSpent || 0),
        0
    );

    // Helper to format date as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Today's stats
    const today = formatDate(new Date());
    const todayActivities = activities.filter((act) => act.entryDate === today);
    const todayHours = todayActivities.reduce((sum, act) => sum + Number(act.totalHoursSpent || 0), 0);

    // Yesterday's stats
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatDate(yesterdayDate);
    const yesterdayActivities = activities.filter((act) => act.entryDate === yesterday);
    const yesterdayHours = yesterdayActivities.reduce((sum, act) => sum + Number(act.totalHoursSpent || 0), 0);

    // This week stats (Mon-Sun)
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7; // Get current day number, converting Sun (0) to 7
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1)); // Go back to Monday
    else startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekActivities = activities.filter((act) => {
        if (!act.entryDate) return false;
        const actDate = new Date(act.entryDate);
        return actDate >= startOfWeek;
    });
    const thisWeekHours = thisWeekActivities.reduce(
        (sum, act) => sum + Number(act.totalHoursSpent || 0),
        0
    );

    // Last week stats
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);

    const lastWeekActivities = activities.filter((act) => {
        if (!act.entryDate) return false;
        const actDate = new Date(act.entryDate);
        return actDate >= startOfLastWeek && actDate <= endOfLastWeek;
    });
    const lastWeekHours = lastWeekActivities.reduce((sum, act) => sum + Number(act.totalHoursSpent || 0), 0);

    return {
        totalHoursYear: totalHours,
        totalHoursMonth: currentMonthHours,
        totalHoursWeek: thisWeekHours,
        totalHoursToday: todayHours,
        totalHoursYesterday: yesterdayHours,
        totalHoursLastWeek: lastWeekHours,
        dateRanges: {
            today,
            yesterday,
            thisWeekStart: formatDate(startOfWeek),
            lastWeekStart: formatDate(startOfLastWeek),
            lastWeekEnd: formatDate(endOfLastWeek)
        },
        totalEntries: activities.length,
        projects: sortedProjects,
        topProject: sortedProjects[0] || null,
        monthlyBreakdown: monthlyHours,
        mostActiveDay: mostActiveDay ? { date: mostActiveDay[0], hours: mostActiveDay[1] } : null,
    };
};

/**
 * Format leave data for context
 */
const formatLeaveData = (leaves, email) => {
    const userLeaves = leaves[email];

    if (!userLeaves) {
        return null;
    }

    const approved = userLeaves.approved || [];
    const pending = userLeaves.pending || [];
    const rejected = userLeaves.rejected || [];

    // Calculate total leave days taken this year
    const currentYear = new Date().getFullYear();
    const approvedThisYear = approved.filter((l) => {
        const year = new Date(l.startDate).getFullYear();
        return year === currentYear;
    });

    return {
        approved: approved.length,
        pending: pending.length,
        rejected: rejected.length,
        approvedThisYear: approvedThisYear.length,
        pendingDetails: pending.map((l) => `${l.leaveType} (${l.startDate} to ${l.endDate})`),
        approvedDetails: approved.slice(0, 5).map((l) => `${l.leaveType} (${l.startDate} to ${l.endDate})`),
    };
};

/**
 * Format leave balance data
 */
const formatLeaveBalances = (leavePolicy) => {
    if (!leavePolicy || leavePolicy.length === 0) {
        return null;
    }

    const userData = leavePolicy[0];
    const records = userData?.leaveRecords || [];

    return records.map((r) => ({
        type: r.leaveType,
        allotted: r.totalLeavesAllotted,
        used: r.usedLeaves,
        pending: r.pendingLeaves,
        balance: r.leaveLeft,
    }));
};

/**
 * Format payroll data
 */
const formatPayrollData = (payroll) => {
    if (!payroll) {
        return null;
    }

    return {
        cycle1: {
            totalHours: payroll.cycle1?.totalHours || 0,
            totalPayableDays: payroll.cycle1?.totalPayableDays || 0,
            paidLeaves: payroll.cycle1?.paidLeaves || 0,
            lwp: payroll.cycle1?.LWP || 0,
        },
        cycle2: {
            totalHours: payroll.cycle2?.totalHours || 0,
            totalPayableDays: payroll.cycle2?.totalPayableDays || 0,
            paidLeaves: payroll.cycle2?.paidLeaves || 0,
            lwp: payroll.cycle2?.LWP || 0,
        },
    };
};

/**
 * Fetch ALL user data for the ENTIRE YEAR - for comprehensive AI context
 */
export const fetchAllUserData = async (email) => {
    const { month, year, monthName } = getCurrentPeriod();

    const [yearActivities, leaves, leavePolicy, payroll] = await Promise.all([
        fetchYearActivities(year, email),
        fetchUserLeaves(),
        fetchLeavePolicy(),
        fetchPayrollSummary(year, month - 1), // month is 0-indexed for payroll API
    ]);

    return {
        period: { month, year, monthName },
        activityStats: calculateYearActivityStats(yearActivities),
        leaveData: formatLeaveData(leaves, email),
        leaveBalances: formatLeaveBalances(leavePolicy),
        payrollData: formatPayrollData(payroll),
    };
};

/**
 * Build a context prompt for the LLM with FULL YEAR data
 */
export const buildContextPrompt = (userData) => {
    const { period, activityStats, leaveData, leaveBalances, payrollData } = userData;

    let context = `You are a helpful assistant for the Daily Activity Tracker app.
Help users understand their work data, leaves, and payroll.
IMPORTANT: Answer ONLY based on the data provided below. Do not guess or calculate complex dates.
If the data is not explicitly shown, say "I don't have that information".
Keep answers short, direct, and friendly.
Today's date: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════
USER'S DATA FOR ${period.year} (FULL YEAR)
═══════════════════════════════════════════════════════════

`;

    // Activity Summary - FULL YEAR
    if (activityStats) {
        context += `📊 ACTIVITY SUMMARY:
• Total hours worked THIS YEAR: ${activityStats.totalHoursYear}h
• Total hours THIS MONTH (${period.monthName}): ${activityStats.totalHoursMonth}h
• Total hours THIS WEEK (since ${activityStats.dateRanges.thisWeekStart}): ${activityStats.totalHoursWeek}h
• Total hours LAST WEEK (${activityStats.dateRanges.lastWeekStart} to ${activityStats.dateRanges.lastWeekEnd}): ${activityStats.totalHoursLastWeek}h
• Total hours TODAY (${activityStats.dateRanges.today}): ${activityStats.totalHoursToday}h
• Total hours YESTERDAY (${activityStats.dateRanges.yesterday}): ${activityStats.totalHoursYesterday}h
• Total activity entries: ${activityStats.totalEntries}
`;

        if (activityStats.topProject) {
            context += `• Top project: ${activityStats.topProject.name} (${activityStats.topProject.hours}h total)
`;
        }

        if (activityStats.projects && activityStats.projects.length > 0) {
            context += `• All projects: ${activityStats.projects.slice(0, 5).map(p => `${p.name}(${p.hours}h)`).join(', ')}
`;
        }

        if (activityStats.mostActiveDay) {
            context += `• Most active day: ${activityStats.mostActiveDay.date} (${activityStats.mostActiveDay.hours}h)
`;
        }

        // Monthly breakdown
        if (activityStats.monthlyBreakdown) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            context += `• Monthly hours: `;
            const monthlyEntries = Object.entries(activityStats.monthlyBreakdown)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, hours]) => {
                    const monthIndex = parseInt(month.split('-')[1], 10) - 1;
                    return `${monthNames[monthIndex]}:${hours}h`;
                });
            context += monthlyEntries.join(', ') + '\n';
        }

        context += '\n';
    } else {
        context += `📊 ACTIVITY SUMMARY:
• No activity data recorded yet.

`;
    }

    // Leave Summary
    if (leaveData) {
        context += `🏖️ LEAVE STATUS:
• Approved leaves this year: ${leaveData.approvedThisYear}
• Pending leaves: ${leaveData.pending}${leaveData.pendingDetails.length > 0 ? ` (${leaveData.pendingDetails.join(', ')})` : ''}
• Rejected leaves: ${leaveData.rejected}

`;
    }

    // Leave Balances
    if (leaveBalances && leaveBalances.length > 0) {
        context += `💼 LEAVE BALANCES:\n`;
        leaveBalances.forEach((lb) => {
            context += `• ${lb.type}: ${lb.balance} remaining (used: ${lb.used}, pending: ${lb.pending}, allotted: ${lb.allotted})\n`;
        });
        context += '\n';
    }

    // Payroll Summary
    if (payrollData) {
        context += `💰 CURRENT PAYROLL CYCLE (${period.monthName}):
• Cycle 1 (1st-25th): ${payrollData.cycle1.totalPayableDays} payable days, ${payrollData.cycle1.totalHours}h worked
• Cycle 2 (26th-end): ${payrollData.cycle2.totalPayableDays} payable days, ${payrollData.cycle2.totalHours}h worked

`;
    }

    context += `═══════════════════════════════════════════════════════════

Answer the user's question based on the above data:`;

    return context;
};

/**
 * Get suggested questions based on available data
 */
export const getSuggestedQuestions = (userData) => {
    const questions = [];
    const { activityStats, leaveData, leaveBalances, payrollData } = userData;

    if (activityStats && activityStats.totalHoursYear > 0) {
        questions.push('How many hours did I work this week?');
        questions.push('Which project took most of my time this year?');
        questions.push('Show my monthly work breakdown');
    }

    if (leaveBalances && leaveBalances.length > 0) {
        questions.push('How many casual leaves do I have left?');
    }

    if (leaveData && leaveData.pending > 0) {
        questions.push("What's the status of my pending leave?");
    }

    if (payrollData) {
        questions.push('How many payable days this cycle?');
    }

    // Default questions
    if (questions.length === 0) {
        questions.push('What can you help me with?');
        questions.push('Show my work summary');
    }

    return questions.slice(0, 4);
};

export default {
    fetchAllUserData,
    buildContextPrompt,
    getSuggestedQuestions,
};
