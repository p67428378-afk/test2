import React from 'react';
import MapView from '../components/map/MapView';
import NWPComparisonPanel from '../components/panels/NWPComparisonPanel';
import GridEditorPanel from '../components/panels/GridEditorPanel';
import WarningCreationPanel from '../components/panels/WarningCreationPanel';
import TextProductPanel from '../components/panels/TextProductPanel';

const DashboardPage = () => {
  return (
    <div className="w-full h-full">
      <MapView />
      {/* The panels would be conditionally rendered based on user interaction */}
      {/* <NWPComparisonPanel /> */}
      {/* <GridEditorPanel /> */}
      {/* <WarningCreationPanel /> */}
      {/* <TextProductPanel /> */}
    </div>
  );
};

export default DashboardPage;
