import Card from "./Card";

const DashboardSkeleton = ({ metricCount = 3, chartCount = 3 }) => {
  return (
    <>
      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${metricCount === 3 ? "lg:grid-cols-3" : ""}`}>
        {Array.from({ length: metricCount }, (_, index) => (
          <Card key={index} hover={false} className="p-6 sm:p-8 animate-pulse">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-48 rounded bg-slate-100" />
            <div className="mt-6 h-12 w-20 rounded bg-slate-200" />
          </Card>
        ))}
      </div>

      <div className={`mt-8 sm:mt-10 grid grid-cols-1 gap-6 ${chartCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {Array.from({ length: chartCount }, (_, index) => (
          <Card key={index} hover={false} className="p-4 sm:p-6 shadow-lg animate-pulse">
            <div className="mb-6 h-6 w-40 rounded bg-slate-200" />
            <div className="mx-auto h-48 w-48 rounded-full bg-slate-100" />
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardSkeleton;
