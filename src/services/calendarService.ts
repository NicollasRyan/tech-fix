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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/calendar/create-event`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, event }),
        signal: controller.signal, // ✅ Vincular ao controller
      },
    );

    clearTimeout(timeoutId); // ✅ Limpar timeout se sucesso

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const error = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      throw new Error(`[${response.status}] ${error.message || error}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Timeout: Requisição demorou mais de 30 segundos");
    }
    throw error;
  }
}
