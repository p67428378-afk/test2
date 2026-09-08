import React, { useState, useEffect, useCallback } from "react";
import FilterToolbar from "../components/FilterToolbar";
import TransactionTable from "../components/TransactionTable";
import LogTransactionModal from "../components/LogTransactionModal";
import { expenseApi, categoryApi } from "../services/api";

export default function TransactionsPage({ currentUser }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 15;

  // Filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      setCategories(data || []);
    } catch {
      // Ignored
    }
  };

  const fetchTransactions = useCallback(
    async (currentSkip = skip) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          skip: currentSkip,
          limit,
        };
        if (search.trim()) params.search = search.trim();
        if (categoryId) params.category_id = categoryId;
        if (transactionType) params.type = transactionType;
        if (paymentMethod) params.payment_method = paymentMethod;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const data = await expenseApi.getExpenses(params);
        setTransactions(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Failed to fetch transactions from server.",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      skip,
      search,
      categoryId,
      transactionType,
      paymentMethod,
      startDate,
      endDate,
    ],
  );

  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  useEffect(() => {
    fetchTransactions(0);
    setSkip(0);
  }, [search, categoryId, transactionType, paymentMethod, startDate, endDate]);

  const handlePageChange = (newSkip) => {
    setSkip(newSkip);
    fetchTransactions(newSkip);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setTransactionType("");
    setPaymentMethod("");
    setStartDate("");
    setEndDate("");
    setSkip(0);
  };

  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSubmitTransaction = async (payload) => {
    setModalLoading(true);
    setModalError("");
    try {
      if (editingTransaction) {
        await expenseApi.updateExpense(editingTransaction.id, payload);
      } else {
        await expenseApi.createExpense(payload);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      fetchTransactions(skip);
    } catch (err) {
      setModalError(
        err.response?.data?.detail || "Failed to save transaction.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this transaction record?",
      )
    ) {
      return;
    }
    try {
      await expenseApi.deleteExpense(id);
      fetchTransactions(skip);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete transaction.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transaction Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, categorize, and log your financial income and
            expenses
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        transactionType={transactionType}
        onTypeChange={setTransactionType}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        categories={categories}
        onOpenLogModal={handleOpenCreateModal}
        onResetFilters={handleResetFilters}
      />

      {/* Data Table */}
      <TransactionTable
        transactions={transactions}
        total={total}
        skip={skip}
        limit={limit}
        onPageChange={handlePageChange}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTransaction}
        loading={loading}
        error={error}
      />

      {/* Add / Edit Transaction Modal */}
      <LogTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
        categories={categories}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
}
