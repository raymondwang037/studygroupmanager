import { useState } from 'react';
import ReportForm from '../components/ReportForm';

export default function ReportPage() {
  const [reportData, setReportData] = useState(null);

  const handleSearch = (data) => {
    setReportData(data);
  };

  return (
    <div>
      <h1>Study Group Report</h1>
      <ReportForm onSearch={handleSearch} />
      {reportData && (
        <div>
          <h2>Report Summary</h2>
          <p>Total Groups: {reportData.totalGroups || 0}</p>
          <p>Average Duration: {reportData.averageDuration?.toFixed(2) || 0} minutes</p>
          <p>Attendance Rate: {reportData.attendanceRate !== undefined ? reportData.attendanceRate.toFixed(2) : 0}%</p>

          <h3>Matching Study Groups</h3>
          <ul>
            {Array.isArray(reportData.studyGroups) && reportData.studyGroups.map((group) => (
              <li key={group._id}>
                {group.name} - Room: {group.room.building} {group.room.number} on {new Date(group.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
