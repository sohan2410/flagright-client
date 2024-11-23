'use client'

import React, { useEffect, useState } from 'react'
import { Skeleton } from './skeleton'
import { columns } from './columns'
import { filterFields } from './constants'
import { DataTable } from './data-table'
import AreaChart from '@/components/charts/area-chart'
import LineChartComponent from '@/components/charts/line-chart'
import PieChartComponent from '@/components/charts/pie-chart'
import type { PaginationState, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { ITransaction } from '@/types/transaction/Transaction'
import axios from 'axios'

interface ApiResponse {
  data: {
    transaction: ITransaction[]
    metadata: {
      totalDocs: number
      limit: number
      page: number
      totalPages: number
      nextPage: number | null
      prevPage: number | null
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export default function TransactionsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [data, setData] = useState<ITransaction[]>([])
  const [metadata, setMetadata] = useState<ApiResponse['data']['metadata']>({
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const search = searchParams

  useEffect(() => {
    console.log('useEffect', pagination, columnFilters, sorting)
    fetchData()
  }, [pagination, columnFilters, sorting])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const queryParams = {
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
        ...convertFiltersToParams(columnFilters),
        ...convertSortingToParams(sorting),
      }
      console.log('queryParams', queryParams)

      const { data: result } = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction`,
        {
          params: queryParams,
          withCredentials: true
        }
      )
      setData(result.data.transaction)
      setMetadata(result.data.metadata)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <React.Suspense fallback={<Skeleton />}>
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        metadata={metadata}
        isLoading={isLoading}
        // @ts-ignore
        filterFields={filterFields}
        defaultColumnFilters={Object.entries(search)
          .map(([key, value]) => ({
            id: key,
            value,
          }))
          .filter(({ value }) => value ?? undefined)}
        onPaginationChange={(newPagination) => {
          setPagination(newPagination)
        }}
        onFilterChange={(filters) => {
          setColumnFilters(filters)
          // Reset to first page when filters change
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        onSortingChange={(newSorting) => {
          setSorting(newSorting)
          // Reset to first page when sorting changes
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        }}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <AreaChart />
      <LineChartComponent />
      {/* <BarChart /> */}
      <PieChartComponent />
    </React.Suspense>
  )
}

function convertFiltersToParams(filters: ColumnFiltersState) {
  const params: Record<string, string> = {}
  filters.forEach((filter) => {
    if (filter.value) {
      params[filter.id] = filter.value as string
    }
  })
  return params
}

function convertSortingToParams(sorting: SortingState) {
  if (!sorting.length) return {}
  return {
    sort: sorting[0].id,
    order: sorting[0].desc ? 'desc' : 'asc',
  }
}
