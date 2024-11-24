import api from "../../../../../shared/api/base";

export interface EmailRegistrationData {
  email: string;
  event_types_id: number[];
}

export const registerEmail = async (
  data: EmailRegistrationData
): Promise<void> => {
  await api.post("/email/register", data);
};
