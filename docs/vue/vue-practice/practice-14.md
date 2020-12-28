```vue
<style scoped>
.rotate-icon{
    transform: rotate(-90deg);
}
.menu-item span{
        display: inline-block;
        overflow: hidden;
        /* width: 69px; */
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
</style>
<template>
    <div class="layout-wrapper" id="wrap">
        <Layout class="layout-outer">
            <Header class="header-wrapper">
                <div class="logo">
                    <span class="logo-desc" @click="$router.replace({path:'/home'})">
                        <Icon custom="iconfont icon-LOGO-xiao" style="font-size: 32px;"></Icon>
                        <Icon custom="iconfont icon-LOGO-wenzi2"></Icon>
                    </span>
                    <!-- <span class="line">&nbsp;|&nbsp;</span>
                    <span class="logo-name">{{systemName}}</span> -->
                </div>
                <Menu mode="horizontal" :active-name="activeName1" @on-select="menuSelect">
                    <div class="layout-nav">
                        <MenuItem v-for="(item, index) in menuList" :name="item.path" :to="item.path" :key="index">
                            <!-- <i :class="item.icon ? item.icon : ''"></i> -->
                            {{ item.name }}
                        </MenuItem>
                    </div>
                </Menu>
                <section class="header-right">
                    <Dropdown @on-click="getDropname">
                        <a href="javascript:void(0)" style="height:100%;display: inline-block;line-height: 48px;color:white;">
                            <Icon type="md-person" />
                            {{username}}  <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="userPwdData">修改密码</DropdownItem>
                            <DropdownItem name="loginOut">退出</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </section>
            </Header>
            <Content class="content-con">
                <Sider ref="side1" hide-trigger collapsible :collapsed-width="60" v-model="isCollapsed">
                    <Menu class="menu-box" ref="iMenu2" :active-name="activeName2" :class="menuitemClasses">
                        <MenuItem v-for="(item, index) in subMenuList" :key="index" :to="item.path" :name="item.path">
                            <Icon type="ios-navigate"></Icon>
                            <span>{{item.name}}</span>
                        </MenuItem>
                    </Menu>
                </Sider>
                <div class="page-card" style="background: #F0F0F0;width: 100%;">
                    <bread-crumbs :list="breadListLast">
                        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                        <span>当前位置：</span>
                    </bread-crumbs>
                    <router-view/>
                </div>
            </Content>
        </Layout>
    </div>
</template>
<script>
import mixin from './mixins/index'
export default {
    mixins: [mixin],
    data () {
        return {
            menuList: [], // 导航菜单
            menuListAll: [], // 所有导航集合
            subMenuList: [], // 左侧子导航
            breadListLast: [], // 面包屑导航
            isCollapsed: false, // 导航展开和收缩
            activeName1: '',
            activeName2: '', // 当前激活菜单
        }
    },
    computed: {
        rotateIcon () {
            return [
                'menu-icon',
                this.isCollapsed ? 'rotate-icon' : ''
            ];
        },
        menuitemClasses () {
            return [
                'menu-item',
                this.isCollapsed ? 'collapsed-menu' : ''
            ]
        }
    },
    methods: {
        getBreadListLast(list, path, navList, ele) {
            list.forEach(e => {
                if (e.path == path) {
                    if (ele) {
                        navList.push({
                            path: ele.path,
                            name: ele.name
                        })
                    }
                    navList.push({
                        path: null,
                        name: e.name,
                    })
                    this.$store.commit('SET_MENU_NAME', e.name)
                } else {
                    if (e.children && e.children.length) {
                        this.getBreadListLast(e.children, path, navList, e)
                    }
                }
            })
        },
        setBreadListLast (list) {
            let arr = JSON.parse(JSON.stringify(list))
            arr.forEach((ele, i) => {
                if (ele.path == '/web-query') {
                    ele.children.push({
                        name: '节点详情统计表',
                        path: '/web-query/query-overview/ip-details'
                    })
                }
                if (ele.path == '/taskSet') {
                    ele.children.push({
                        name: '创建监测任务',
                        path: '/taskSet/task-create'
                    })
                }
                if (ele.path == '/taskSet') {
                    ele.children.push({
                        name: '创建策略',
                        path: '/taskSet/rule-create'
                    })
                }
                if (ele.path == '/web-task') {
                    ele.children.push({
                        name: '创建监测任务',
                        path: '/web-task/task-create'
                    })
                }
                if (ele.path == '/web-task') {
                    ele.children.push({
                        name: '创建策略',
                        path: '/web-task/rule-create'
                    })
                }
                if (ele.path == '/ping-warn') {
                    ele.children.push({
                        name: '告警详情',
                        path: '/ping-warn/warn-list/warn-details'
                    })
                }
                if (ele.path == '/web-warn') {
                    ele.children.push({
                        name: '告警详情',
                        path: '/web-warn/warn-list/warn-details'
                    })
                }
                if (ele.path == '/test') {
                    ele.children.push({
                        name: '即时拨测详情',
                        path: '/test/dial/details'
                    })
                }
                if (ele.path == '/test') {
                    ele.children.push({
                        name: '测试详情',
                        path: '/test/dial/details/list'
                    })
                }
                if (ele.path == '/web-dial') {
                    ele.children.push({
                        name: '即时拨测详情',
                        path: '/web-dial/dial-config/dial-details'
                    })
                }
            })
            return arr
        },
        menuSelect (name) {
            // console.log(name)
            // console.log(this.menuList)
            this.menuList.forEach(ele => {
                if (name == ele.path) {
                    this.subMenuList = [...ele.children]
                }
            })
        },
        collapsedSider () {
            this.$refs.side1.toggleCollapse();
        }
    },
    mounted () {
        
    },
    watch: {
        $route (to, from) {
            console.log(to)
            this.activeName2 = to.path
            this.$nextTick(() => {
                this.$refs.iMenu2.updateActiveName()
            })
            this.breadListLast = []
            this.getBreadListLast(this.menuListAll, to.path, this.breadListLast)
        }
    }
}
</script>
<style lang="less" scoped>
@import './../../style/custom.less';
.layout-wrapper,
.layout-outer {
    height: 100%;
    background: none;
    .header-wrapper {
        background: url(./../../assets/img/nav_bg.png) no-repeat 0 0;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        display: flex;
        padding: 0 23px;
        .trigger-icon {
            cursor: pointer;
            transition: transform 0.3s ease;
            &.rotate {
                transform: rotateZ(-90deg);
                transition: transform 0.3s ease;
            }
        }
    }
    .content-con {
        display: flex;
        flex-direction: row;
        height: ~"calc(100vh - 64px)";
        .page-card {
            overflow: hidden;
            overflow-y: auto;
            width: fill-available;
        }
    }
}
.menu-box {
    width: 100%!important;
}
</style>
```
