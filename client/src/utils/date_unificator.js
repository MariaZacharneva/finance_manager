import {DateTime} from "luxon";

export function UnifyDate(date) {
    const date_locale_string = date.toLocaleDateString("en-GB");
    const luxon_datetime = DateTime.fromFormat(date_locale_string, "dd/MM/yyyy");
    return luxon_datetime.toSQLDate();
}