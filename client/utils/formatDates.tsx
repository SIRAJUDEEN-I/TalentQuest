import moment from "moment";

export const formatDates = (date: string) => {
  return moment(date).fromNow();
};


