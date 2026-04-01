const DEFAULT_SEJM_BASE_URL = "https://api.sejm.gov.pl/sejm";
const CURRENT_TERM = "/term10"

const API_BASE_URL = `${DEFAULT_SEJM_BASE_URL}${CURRENT_TERM}`

export const MP_URL = `${API_BASE_URL}/MP`;
export const CLUB_URL = `${API_BASE_URL}/clubs`;
export const BILLS_URL = `${API_BASE_URL}/bills`;
