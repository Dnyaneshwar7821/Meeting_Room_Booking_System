import Button from "./Button";
import Card from "./Card";

const PanelMessage = ({ title, description, actionLabel, onAction }) => {
  return (
    <Card hover={false} className="p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <span className="text-xl font-bold">!</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default PanelMessage;
