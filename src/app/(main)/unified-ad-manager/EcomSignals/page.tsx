"use client";

const CampaignAnalytics = () => {
  const powerBiUrl =
    "https://app.powerbi.com/view?r=eyJrIjoiZmQzNzI0ZWItMjY4ZS00M2Q5LTg0NTgtOTFmOTU3YTc0NmE4IiwidCI6IjE1M2RhMTU0LTY3NGMtNDViOS1hMWU1LWI0MGZhY2ZlOWU3MiJ9";

  return (
    <div className="h-screen w-full">
      <iframe
        title="Ecom Signal's"
        src={powerBiUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allowFullScreen
      />
    </div>
  );
};

export default CampaignAnalytics;
