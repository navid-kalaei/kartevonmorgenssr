import { FC, Fragment, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useToggle } from 'ahooks'

import { Layout, Spin } from 'antd'

import { AxiosInstance } from '../../api'
import MapPageConfigs from '../../dtos/MapPageConfigs'
import API_ENDPOINTS from '../../api/endpoints'
import { convertQueryParamToArray } from '../../utils/utils'
import RouterQueryInitializer from '../../components/RouterQueryInitializer'

import { MapLocationProps } from '../../components/Map'
import { TagsCount } from '../../dtos/TagCount'
import PopularTagsRequest from '../../dtos/PopularTagsRequest'
import Sidebar from '../../components/Sidebar'

const { Content, Sider } = Layout


interface MapPageProps {
  popularTags: TagsCount
  mapLocationProps: MapLocationProps
}

const MapPage: FC<MapPageProps> = (props) => {
  const { mapLocationProps } = props

  const [
    isLoading,
    {
      setRight: setNotLoading,
    },
  ] = useToggle(true)

  const Map = useMemo(() => dynamic(
    () => import('../../components/Map').then(
      (mod) => {
        setNotLoading()
        return mod.default
      },
    ),
    {
      ssr: false,
    },
  ), [])

  const [isSideBarCollapsed, { toggle: toggleIsSideBarCollapsed }] = useToggle()

  return (
    <Fragment>
      <RouterQueryInitializer
        initMapLocationProps={mapLocationProps}
      />

      <Layout
        hasSider
      >
        <Sider
          theme="light"
          collapsible
          collapsed={isSideBarCollapsed}
          onCollapse={toggleIsSideBarCollapsed}
          width="32vw"
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {!isSideBarCollapsed && <Sidebar tagsCount={props.popularTags}/>}
        </Sider>

        <Content>
          <Spin spinning={isLoading}>
            <div id="map">
              <Map/>
            </div>
          </Spin>
        </Content>

      </Layout>
    </Fragment>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params
  const path = convertQueryParamToArray(slug)

  // we expect to have path always not empty with the first element of project name
  const project = path[0]

  // set configs
  const pageConfigsReq = await AxiosInstance.GetRequest<MapPageConfigs>(
    API_ENDPOINTS.getMapPageConfigs(project),
  )

  const pageConfigs = AxiosInstance.GetSuccessData(pageConfigsReq)
  const mapLocationProps = pageConfigs.map.location

  // get popular tags
  const popularTagsRequestParams: PopularTagsRequest = {
    min_count: pageConfigs.popularTags.min_count,
    max_count: pageConfigs.popularTags.max_count,
    limit: pageConfigs.popularTags.limit,
    offset: pageConfigs.popularTags.offset,
  }
  const popularTagsReq = await AxiosInstance.GetRequest<TagsCount>(
    API_ENDPOINTS.getPopularTags(),
    {
      params: popularTagsRequestParams,
    },
  )
  const popularTags = AxiosInstance.GetSuccessData(popularTagsReq)

  //todo: move the re-validate value to constants
  return {
    props: {
      mapLocationProps,
      popularTags,
    },
  }
}

export default MapPage