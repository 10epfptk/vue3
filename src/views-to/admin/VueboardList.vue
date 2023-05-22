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
      board_type: 'A', //게시판 타입 (A:관리자공지, B:강사공지, C:QnA )
      board_name: '공지 사항', //게시판 이름
      menu_name: '학습 지원', //메뉴명
    };
  },
  methods: {},
};
</script>
