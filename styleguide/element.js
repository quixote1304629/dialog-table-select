import Vue from 'vue'
import Elm from 'element-ui'
import FormRenderer from '@femessage/el-form-renderer'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Elm)

Vue.component('ElFormRenderer', FormRenderer)
