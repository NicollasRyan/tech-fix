export async function createCalendarEvent(
  accessToken: string,
  {
    clientName,
    serviceType,
    notificationDate,
  }: {
    clientName: string;
    serviceType?: string;
    notificationDate: Date;
  },
) {
  const startDate = notificationDate.toISOString().split("T")[0];

  const nextDay = new Date(notificationDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const endDate = nextDay.toISOString().split("T")[0];
  const event = {
    summary: `Manutenção - ${clientName}`,
    serviceType: serviceType || "",
    start: {
      date: startDate,
    },
    end: {
      date: endDate,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 4320 }, // 3 dias antes
        { method: "email", minutes: 0 }, // no dia
      ],
    },
  };

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
}
