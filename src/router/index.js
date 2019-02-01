import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home';
import Chatroom from '@/pages/Chatroom';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/chatroom',
            name: 'chatroom',
            component: Chatroom
        }
    ]
});
