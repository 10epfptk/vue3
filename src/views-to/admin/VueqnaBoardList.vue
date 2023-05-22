<template>
  <child-component
    :board_type="board_type"
    :board_name="board_name"
    :menu_name="menu_name"
  ></child-component>
</template>
<script>
import Vuenotice from './Vuenotice.vue';
export default {
  name: 'VueBoardList',
  components: {
    'child-component': Vuenotice,
  },
  data: function () {
    return {
      board_type: 'C', //게시판 타입 (A:관리자공지, B:강사공지, C:QnA )
      board_name: 'Q & A', //게시판 이름
      menu_name: '커뮤니티', //메뉴명
    };
  },
  methods: {},
};
</script>
