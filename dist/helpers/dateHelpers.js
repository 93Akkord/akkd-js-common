Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get difference in days between two dates.
 *
 * @param {Date} dt1
 * @param {Date} dt2
 * @returns
 */
function dateDiffInDays(dt1, dt2) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
    var utc2 = Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
exports.dateDiffInDays = dateDiffInDays;
