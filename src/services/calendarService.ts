export async function createCalendarEvent(
  userId: string,
  {
    clientName,
    serviceType,
    notificationDate,
    description,
  }: {
    clientName: string;
    serviceType?: string;
    notificationDate: Date;
    description?: string;
  },
) {
  const startDate = notificationDate.toISOString().split("T")[0];

  const nextDay = new Date(notificationDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const endDate = nextDay.toISOString().split("T")[0];

  const event = {
    summary: `Manutenção - ${clientName}`,
    description: `
Cliente: ${clientName}
Tipo de serviço: ${serviceType || "Não informado"}

Descrição do serviço:
${description || ""}
  `,
    start: {
      date: startDate,
      timeZone: "America/Sao_Paulo",
    },
    end: {
      date: endDate,
      timeZone: "America/Sao_Paulo",
    },
    extendedProperties: {
      private: {
        serviceType: serviceType || "",
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 4320 },
        { method: "email", minutes: 0 },
      ],
    },
  };

  const response = await fetch(
    `${process.env.REACT_APP_BASE_URL}/calendar/create-event`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: userId, event }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
}
