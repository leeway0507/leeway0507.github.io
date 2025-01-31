import { parseISO, format } from "date-fns";

function DateFormatter({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "yyyy-MM-dd")}</time>;
}

export default DateFormatter;
