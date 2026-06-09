import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultScenarios, getSKUPerformance, recalculateScenario } from '../services/api';
import ScenarioCard from '../components/assortment/ScenarioCard';
import SKUDataTable from '../components/assortment/SKUDataTable';
import Button from '../components/common/Button';

const ScenarioComparisonPage = ({
  selectedScenario,
  setSelectedScenario,
  adjustments,
  setAdjustments,
  searchTerm,
}) => {
  const [scenarios, setScenarios] = useState([]);
  const [skuData, setSkuData] = useState({ items: [], total: 0, page: 1, limit: 10 });
  const [sortBy, setSortBy] = useState('-sales');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getDefaultScenarios();
        setScenarios(data.scenarios);
        // Pre-select Balanced scenario if none selected
        if (!selectedScenario) {
          const balanced = data.scenarios.find((s) => s.name === 'Balanced');
          if (balanced) {
            setSelectedScenario(balanced);
          }
        }
      } catch (error) {
        console.error('Failed to fetch scenarios:', error);
      }
    };
    fetchScenarios();
  }, [selectedScenario, setSelectedScenario]);

  useEffect(() => {
    const fetchSKUs = async () => {
      setLoading(true);
      try {
        const data = await getSKUPerformance({
          filter: searchTerm,
          limit: 10,
          skip: (page - 1) * 10,
          sort_by: sortBy,
        });
        setSkuData(data);
      } catch (error) {
        console.error('Failed to fetch SKUs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSKUs();
  }, [searchTerm, page, sortBy]);

  const handleActionChange = async (skuId, action) => {
    const updatedAdjustments = { ...adjustments, [skuId]: action };
    setAdjustments(updatedAdjustments);

    if (!selectedScenario) return;

    // Recalculate metrics for the selected scenario
    const adjustmentsList = Object.entries(updatedAdjustments).map(([id, act]) => ({
      sku_id: id,
      action: act,
    }));

    try {
      const recalculated = await recalculateScenario({
        scenario_id: selectedScenario.scenario_id,
        name: selectedScenario.name,
        adjustments: adjustmentsList,
      });

      // Update the selected scenario with recalculated metrics
      setSelectedScenario({
        ...selectedScenario,
        projected_sales: recalculated.projected_sales,
        change_in_private_brand_pct: recalculated.change_in_private_brand_pct,
        shelf_utilization_pct: recalculated.shelf_utilization_pct,
      });

      // Also update the scenario list
      setScenarios((prev) =>
        prev.map((s) =>
          s.scenario_id === selectedScenario.scenario_id
            ? {
                ...s,
                projected_sales: recalculated.projected_sales,
                change_in_private_brand_pct: recalculated.change_in_private_brand_pct,
                shelf_utilization_pct: recalculated.shelf_utilization_pct,
              }
            : s
        )
      );
    } catch (error) {
      console.error('Failed to recalculate scenario:', error);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='text-lg font-bold text-on-surface'>Scenario Comparison</h3>
          <p className='text-xs text-on-surface-variant'>Compare and adjust assortment scenarios side-by-side</p>
        </div>
        <Button onClick={() => navigate('/approval')} disabled={!selectedScenario}>
          Proceed to Approval Review
        </Button>
      </div>

      {/* Side-by-side Scenarios */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.scenario_id}
            scenario={scenario}
            isSelected={selectedScenario?.scenario_id === scenario.scenario_id}
            onSelect={() => handleScenarioSelect(scenario)}
          />
        ))}
      </div>

      {/* SKU Action Table */}
      <div className='space-y-4'>
        <div className='border-b border-outline-variant pb-2'>
          <h4 className='text-sm font-bold text-on-surface uppercase tracking-wider'>
            Adjust SKU Assortment Actions
          </h4>
          <p className='text-xs text-on-surface-variant'>
            Select actions for individual SKUs to dynamically recalculate the selected scenario's impact
          </p>
        </div>
        <SKUDataTable
          items={skuData.items}
          total={skuData.total}
          page={page}
          limit={10}
          onPageChange={setPage}
          onSort={setSortBy}
          sortBy={sortBy}
          actionsEnabled={true}
          selectedActions={adjustments}
          onActionChange={handleActionChange}
        />
      </div>
    </div>
  );
};

export default ScenarioComparisonPage;
