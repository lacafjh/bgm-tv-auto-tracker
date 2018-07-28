import { $, tm_openInTab, tm_unsafeWindow, URLS } from './vars'
import App from './App.vue'
import Vue from 'vue'
import { BgmApi, getAuth, saveAuth } from './utils'
import axios from 'axios'
import { bilibili, iQiyi } from './website'

if (tm_unsafeWindow.location.href.startsWith(URLS.callBackUrl)) {
  if (tm_unsafeWindow.data) {
    saveAuth(tm_unsafeWindow.data)
    // tm_setValue('auth', JSON.stringify(tm_unsafeWindow.data))
    let child = tm_unsafeWindow.document.createElement('h1')
    child.innerText = '成功授权 请关闭网页 授权后不要忘记刷新已经打开的视频网页'
    tm_unsafeWindow.document.body.appendChild(child)
  }
}
let website
// inject bilibili
if (tm_unsafeWindow.location.href.startsWith('https://www.bilibili.com/bangumi/play/')) {
  website = 'bilibili'
  $('#bangumi_detail > div > div.info-right > div.info-title.clearfix > div.func-module.clearfix')
    .prepend(`<div id='bgm_tv_app'></div>`)
}

// inject iqiyi
if (tm_unsafeWindow.location.hostname === 'www.iqiyi.com') {
  if (tm_unsafeWindow.Q.PageInfo.playPageInfo.categoryName === '动漫') {
    website = 'iqiyi'
    $('#jujiPlayWrap > div:nth-child(2) > div > div > div.funcRight.funcRight1014')
      .prepend(`<div id='bgm_tv_app'></div>`)
  }

}

if ($('#bgm_tv_app')) {
  getAuth().then(
    auth => {
      if (auth) {
        /**
         * @type {BgmApi}
         */
        Vue.prototype.$bgmApi = new BgmApi({ access_token: auth.access_token })
        Vue.prototype.$http = axios
      } else {
        tm_openInTab(URLS.authURL, { active: true })
      }
      if (website) {
        if (website === 'bilibili') Vue.prototype.$website = bilibili
        if (website === 'iqiyi') Vue.prototype.$website = iQiyi
        let vm = new Vue({
          el: '#bgm_tv_app',
          render: h => h(App),
        })
        tm_unsafeWindow.vm = vm
      }
    })
}
