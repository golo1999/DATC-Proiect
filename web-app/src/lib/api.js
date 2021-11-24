const { REACT_APP_REALTIME_DATABASE_URL: FIREBASE_DOMAIN } = process.env;

export async function getAllReports() {
  const response = await fetch(`${FIREBASE_DOMAIN}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch quotes.");
  }

  console.log(data);

  const reportsList = [];

  return reportsList;
}
