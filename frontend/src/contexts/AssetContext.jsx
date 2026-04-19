import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { getAllAssets, searchAssets, createAsset, updateAsset, deleteAsset, updateAssetStatus } from '../api/assetApi';

// Initial state
const initialState = {
  assets: [],
  loading: false,
  error: null,
  filters: {
    type: '',
    status: '',
    minCapacity: '',
    location: '',
    name: ''
  },
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  }
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ASSETS: 'SET_ASSETS',
  ADD_ASSET: 'ADD_ASSET',
  UPDATE_ASSET: 'UPDATE_ASSET',
  REMOVE_ASSET: 'REMOVE_ASSET',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_FILTERS: 'RESET_FILTERS'
};

// Reducer
function assetReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_ASSETS:
      return {
        ...state,
        assets: action.payload.content || action.payload,
        pagination: {
          ...state.pagination,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || action.payload.length,
          page: action.payload.pageable?.pageNumber || 0,
          size: action.payload.pageable?.pageSize || state.pagination.size
        },
        loading: false,
        error: null
      };
    case ACTIONS.ADD_ASSET:
      return {
        ...state,
        assets: [action.payload, ...state.assets],
        pagination: {
          ...state.pagination,
          totalElements: state.pagination.totalElements + 1
        }
      };
    case ACTIONS.UPDATE_ASSET:
      return {
        ...state,
        assets: state.assets.map(asset =>
          asset.id === action.payload.id ? action.payload : asset
        )
      };
    case ACTIONS.REMOVE_ASSET:
      return {
        ...state,
        assets: state.assets.filter(asset => asset.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalElements: state.pagination.totalElements - 1
        }
      };
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    case ACTIONS.RESET_FILTERS:
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}

// Context
const AssetContext = createContext();

// Provider component
export function AssetProvider({ children }) {
  const [state, dispatch] = useReducer(assetReducer, initialState);
  const stompClientRef = useRef(null);

  // Actions
  const fetchAssets = async (page = state.pagination.page, size = state.pagination.size) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const data = await getAllAssets(page, size);
      dispatch({ type: ACTIONS.SET_ASSETS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const fetchActiveAssets = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const data = await searchAssets({ status: 'ACTIVE' });
      dispatch({ type: ACTIONS.SET_ASSETS, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const client = new Client({
        brokerURL: 'ws://localhost:8081/ws/websocket',
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('Connected to WebSocket');

          client.subscribe('/topic/resources', (message) => {
            const wsMessage = JSON.parse(message.body);
            console.log('Received WebSocket message:', wsMessage);

            // Refresh the active asset list when any change occurs
            fetchActiveAssets();
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
        }
      });

      client.activate();
      stompClientRef.current = client;
    };

    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const setFilters = (filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
    dispatch({ type: ACTIONS.SET_PAGINATION, payload: { page: 0 } }); // Reset to first page
  };

  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
    dispatch({ type: ACTIONS.SET_PAGINATION, payload: { page: 0 } });
  };

  const createNewAsset = async (assetData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const newAsset = await createAsset(assetData);
      dispatch({ type: ACTIONS.ADD_ASSET, payload: newAsset });
      return newAsset;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateExistingAsset = async (id, assetData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const updatedAsset = await updateAsset(id, assetData);
      dispatch({ type: ACTIONS.UPDATE_ASSET, payload: updatedAsset });
      return updatedAsset;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const removeAsset = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await deleteAsset(id);
      dispatch({ type: ACTIONS.REMOVE_ASSET, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateAssetStatusAction = async (id, newStatus) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const updatedAsset = await updateAssetStatus(id, newStatus);
      dispatch({ type: ACTIONS.UPDATE_ASSET, payload: updatedAsset });
      return updatedAsset;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setPagination = (pagination) => {
    dispatch({ type: ACTIONS.SET_PAGINATION, payload: pagination });
  };

  const value = {
    // State
    assets: state.assets,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,

    // Actions
    fetchAssets,
    fetchActiveAssets,
    setFilters,
    resetFilters,
    createAsset: createNewAsset,
    updateAsset: updateExistingAsset,
    deleteAsset: removeAsset,
    updateAssetStatus: updateAssetStatusAction,
    setPagination
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
}

// Custom hook
export function useAssets() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}