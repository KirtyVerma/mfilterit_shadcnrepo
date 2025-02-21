'use client';

const CampaignAnalytics = () => {
  const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiNGI2NDY2YWItYmM3NC00OGRiLWI5MjgtZTA4ZGM0NTExNjE5IiwidCI6IjE1M2RhMTU0LTY3NGMtNDViOS1hMWU1LWI0MGZhY2ZlOWU3MiJ9";

  return (
    <div className="w-full h-screen">
      <iframe
        title="Campaign Analytics Dashboard"
        src={powerBiUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default CampaignAnalytics;
