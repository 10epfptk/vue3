<template>
  <!-- titleArea Start-->
  <div id="titleArea">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">{{ menu_name }}</span>
      <span class="btn_nav bold" id="board_name">{{ board_name }}</span>

      <a
        href=""
        class="btn_set refresh"
        id="btn_refresh"
        name="btn"
        @click.prevent="btn_refresh"
        >새로고침</a
      >
    </p>
    <p class="conTitle" style="text-align: center">
      <span id="board_name">{{ board_name }}</span>
      <!-- 게시판 공지/Q&A 타이틀 -->
    </p>
  </div>
  <!-- titleArea End-->
  <!-- searchArea Start-->
  <div
    class="fr"
    id="searchArea"
    style="
      width: 568px;
      display: flex;
      justify-content: space-between;
      justify-content: flex-end;
    "
  >
    <select
      id="searchType"
      class="searchType"
      name="searchType"
      v-model="searchType"
      style="width: 150px"
      @change="doMouseOver()"
    >
      <option value="all">전 체</option>
      <option value="board_title">제 목</option>
      <option value="name">작성자</option>
    </select>
    <input
      type="text"
      style="width: 230px"
      id="searchKeyword"
      class="searchKeyword"
      name="searchKeyword"
      ref="searchKeyword"
      v-model.trim="searchKeyword"
      @keyup.enter="fn_searchCheck()"
      @mouseover="doMouseOver()"
      :placeholder="placeholder"
    />
    <a
      href=""
      class="btnType blue"
      id="btnSearch"
      @click.prevent="fn_searchCheck()"
      name="btn"
      ><span>검 색</span></a
    >
    <span id="fn_btn_create" v-show="fn_btn_create">
      <a
        href=""
        class="btnType blue"
        name="modal"
        @click.prevent="boardregpopup"
        ><span>글등록</span></a
      ></span
    >
  </div>
  <!-- searchArea End-->

  <br /><br /><br />

  <!-- boardList 목록 Start -->
  <div id="boardList">
    <div style="text-align: center; color: darkblue">
      [ 총 글 수 : <span id="totCnt" v-text="totalCnt"></span> ]
    </div>
    <table id="table_row_get" class="col">
      <caption>
        caption
      </caption>
      <colgroup>
        <col width="10%" />
        <col width="50%" />
        <col width="10%" />
        <col width="10%" />
        <col width="15%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">순번</th>
          <th scope="col">제 &emsp; 목</th>
          <th scope="col">작성자</th>
          <th scope="col">조회수</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <!-- 게시판 리스트  Start -->
      <template v-if="totalCnt == 0">
        <tbody>
          <tr>
            <td colspan="5">데이터가 존재하지 않습니다.</td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody
          v-for="(list, index) in listitem"
          :key="index"
          :id="list.board_seq"
        >
          <tr style="border: 0px solid #00ff00">
            <td>{{ list.rowNum }}</td>
            <td
              @click="fn_boardregpopup($event)"
              style="text-align: left"
              :key="list.board_seq"
              :id="list.board_seq"
            >
              {{ list.board_title }}
              <template v-if="list.reCnt > 0">
                &emsp;<span
                  style="text-align: right; color: #1e90ff; font-size: 8pt"
                  >[답글:{{ list.reCnt }}]</span
                >
              </template>
            </td>
            <td>{{ list.loginName }}</td>
            <td>{{ list.board_view }}</td>
            <td>{{ list.board_regdate.substring(0, 10) }}</td>
          </tr>
        </tbody>
      </template>
      <tr style="width: 100%; height: 5px; background-color: #f4f4f4">
        <td colspan="5"></td>
      </tr>
    </table>
    <!-- boardList 목록 End -->
    <!-- 페이징 구간 Start-->
    <paginate
      class="justify-content-center"
      v-model="cpage"
      v-if="totalCnt > 0"
      :page-count="pagenumsize"
      :page-range="blocksize"
      :margin-pages="0"
      :click-handler="boardlistsearch"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate>
    <!-- 페이징 구간 End-->
    <!-- 페이징 구간2: 콤포넌트 작업중 Start-->
    <!--
    <paginate2
      v-if="totalCnt > 0"
      v-model="cpage"
      :c-page="cpage"
      :totalCnt="totalCnt"
      :page-size="pagesize"
      :block-size="blocksize"
      :margin-pages="0"
      :click-handler="boardlistsearch"
    ></paginate2>
    -->
    <!-- 페이징 구간2: End-->
  </div>
</template>

<script>
import { openModal } from 'jenesius-vue-modal';
import Paginate from 'vuejs-paginate-next';
//import Paginate2 from '@/components/common/PaginationHtml.vue';
import VueboardModal from './VueboardModal.vue';

export default {
  name: 'Vuenotice',
  props: {
    board_type: String, //게시판 타입-부모로 부터 데이터 받음
    board_name: String, //게시판 이름-부모로 부터 데이터 받음
    menu_name: String, //메뉴명-부모로 부터 데이터 받음
  },
  data: function () {
    return {
      loginID: '', //로그인 회원  ID
      loginName: '', //로그인 회원 이름
      user_type: '', //회원 구분 (A:관리자, B:강사, C:승인안된강사, D:학생 )
      searchType: 'all',
      searchKeyword: '',
      fn_btn_create: true, //글 등록 버튼
      listitem: [],
      totalCnt: 0, //전체 글 수
      reCnt: 0, //답글 수
      btype: '',
      cpage: 1,
      pagesize: 10,
      blocksize: 5,
      pagenumsize: 0,
      board_seq: 0,

      popupTitle: '',
      action: 'R', //게시판 액션, , 기본 읽기 모드

      board_title: '',
      placeholder: '검색어를 입력하세요',
    };
  },
  computed: {},
  components: {
    paginate: Paginate,
    //paginate2: Paginate2,
  },
  mounted() {
    let vm = this;
    let loginInfo = vm.$store.state.loginInfo;

    vm.loginID = loginInfo.loginId; //로그인 아이디
    vm.loginName = loginInfo.userNm; //로그인 이름
    vm.user_type = loginInfo.userType; //유저타입

    /**--------사용자 접속에 따른 CRUD 권한 설정 Start----------------------*/
    if (this.board_type == 'A') {
      //A:관리자 공지 권한
      switch (this.user_type) {
        case 'B':
        case 'C':
        case 'D': //user_type권한
          this.fn_btn_create = false;
          break;
      }
    } else if (this.board_type == 'B') {
      //B:강사 공지 권한
      switch (this.user_type) {
        case 'C':
        case 'D': //user_type권한
          this.fn_btn_create = false;
          break;
      }
    } else if (this.board_type == 'C') {
      //C:QnA 권한
      switch (this.user_type) {
        case 'B':
        case 'C': //user_type권한
          this.fn_btn_create = false;
          break;
      }
    }
    /**--------사용자 접속에 따른 CRUD 권한 설정  End----------------------*/

    vm.boardlistsearch(); //목록 리스트
  },
  methods: {
    test: function () {
      console.log('page test');
    },

    fn_searchCheck: function () {
      //검색 체크

      if (this.searchType == 'all') {
        this.cpage = 1;
        this.boardlistsearch(); //게시판 글목록
      } else {
        let chk = this.$emptyValidation([
          {
            itemname: this.searchKeyword,
            emptymsg: '검색어를 입력해 주세요 ~',
          },
        ]);
        if (!chk) {
          return;
        } else {
          this.cpage = 1;
          this.boardlistsearch();
        }
      }
    },
    boardlistsearch: function () {
      let vm = this;

      console.log(
        'loginID : ' +
          vm.loginID +
          ', loginName : ' +
          vm.loginName +
          ', user_type : ' +
          vm.user_type +
          ', menu_name :' +
          vm.menu_name
      );
      console.log('board_type : ' + vm.board_type);
      let param = new URLSearchParams();
      param.append('pagenum', vm.cpage);
      param.append('pageSize', vm.pagesize);
      param.append('pagenumsize', vm.pagenumsize);
      param.append('board_type', vm.board_type);
      param.append('searchType', vm.searchType);
      param.append('searchKeyword', vm.searchKeyword);

      this.axios
        .post('/admin/vuecombiList.do', param)
        .then(function (res) {
          console.log(res);

          vm.listitem = res.data.boardlist;
          vm.totalCnt = res.data.totalcnt;
          vm.pagenumsize = vm.page(vm.totalCnt, vm.pagesize);
          console.log('board totalCnt : ' + vm.totalCnt);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    boardregpopup: function (event) {
      this.action = 'I';
      this.fn_boardregpopup(event);
    },
    fn_boardregpopup: function (event) {
      this.board_seq = event.currentTarget.id;
      //this.action = this.action;
      this.spanFile = '';

      //console.log('게시판 글 등록 수정 action : ' + this.action);
      console.log('board_seq : ' + this.board_seq);
      console.log('action : ' + this.action);

      // 게시판 글 등록, 글보기 조건
      if (this.board_seq == 0) {
        //글 등록 버튼 클릭시

        this.action = 'I'; //	id=action value값 I로 설정 . controller에서 핸들링

        //this.fn_btnHide2(); //수정, 삭제 버튼 숨김
      } else {
        //게시글  보기인 경우
        this.action = 'R';
      }

      this.fn_selectboard(); // 글 1건 실행 function
    },

    fn_selectboard: async function () {
      // 글 1건 실행 function
      let vm = this;
      console.log('fn_selectboard action : ' + vm.action);
      let modal = '';
      if (vm.action == 'I') {
        vm.popupTitleName = '글 등록';
        modal = await openModal(VueboardModal, {
          popupTitleName: vm.popupTitleName,
          board_seq: 0,
          action: vm.action,
          loginName: vm.loginName,
          loginID: vm.loginID,
          board_type: vm.board_type,
          user_type: vm.user_type,
        });
        modal.onclose = (popupParam) => {
          //console.log('Close : ' + popupParam);
          vm.boardlistsearch(popupParam); //새로고침 안먹힘??
        };
      } else if (vm.action == 'R') {
        //alert('board_seq typeof : ' + typeof vm.board_seq);
        vm.popupTitleName = '글 보 기';
        modal = await openModal(VueboardModal, {
          popupTitleName: vm.popupTitleName,
          board_seq: parseInt(vm.board_seq),
          action: vm.action,
          loginName: vm.loginName,
          loginID: vm.loginID,
          board_type: vm.board_type,
          user_type: vm.user_type,
          page: vm.page,
        });
        modal.onclose = (popupParam) => {
          console.log('Close : ' + popupParam);
          vm.boardlistsearch(); //새로고침 안먹힘??
        };
      }
    },
    btn_refresh: function () {
      this.cpage = 1;
      this.searchKeyword = '';
      this.boardlistsearch();
    },
    doMouseOver: function () {
      //포커스
      if (this.searchType == 'all') {
        this.searchKeyword = '';
        this.placeholder = '전체 검색시 Enter Key!';
      } else {
        this.placeholder = '';
      }
      this.$refs.searchKeyword.focus();
    },
    page: function (total, page) {
      var rest = total % page;
      var result = parseInt(total / page);

      if (rest == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>
