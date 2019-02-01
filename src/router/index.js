import Vue from 'vue';
import Router from 'vue-router';
import Chatroom from '@/pages/Chatroom';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'chatroom',
            component: Chatroom
        }
    ]
});
