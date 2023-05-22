<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">인원 관리</span>
      <span class="btn_nav bold">학생/강사 관리</span>
    </p>
    <p class="conTitle" id="searcharea">
      <span>인원 관리 </span>
      <span class="fr">
        <select id="select" name="select" v-model="select">
          <option value="">전체</option>
          <option value="loginID">아이디</option>
          <option value="name">이름</option>
        </select>
        &nbsp;
        <input type="text" id="search" name="search" v-model="search" style="height: 30px" />&nbsp;
        <a href="" class="btnType blue" @click.prevent="userlist()"><span>검색</span></a><br />
      </span>
    </p>

    <span class="fr">
      <input type="radio" name="radio" v-model="radios" value="" @change="userlist()" />
      전체
      <input type="radio" name="radio" v-model="radios" value="B" @change="userlist()" />
      강사
      <input type="radio" name="radio" v-model="radios" value="C" @change="userlist()" />
      일반
      <input type="radio" name="radio" v-model="radios" value="D" @change="userlist()" />
      학생
    </span>
    <br />
    <br />

    <div id="divUserList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="12%" />
          <col width="8%" />
          <col width="13%" />
          <col width="18%" />
          <col width="18%" />
          <col width="23%" />
          <col width="8%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">아이디</th>
            <th scope="col">구분</th>
            <th scope="col">학번</th>
            <th scope="col">이름</th>
            <th scope="col">연락처</th>
            <th scope="col">이메일</th>
            <th scope="col">탈퇴여부</th>
          </tr>
        </thead>
        <template v-if="totalcnt == 0">
          <tbody>
            <tr>
              <td colspan="7">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="item in listitem" :key="item">
            <tr>
              <td>
                <a href="" @click.prevent="modalOpen(item.user_type, item.loginID)">{{ item.loginID }}</a>
              </td>
              <td>{{ item.type }}</td>
              <td v-if="item.stu_num != null">{{ item.stu_num }}</td>
              <td v-else>-</td>
              <td>{{ item.name }}</td>
              <td>{{ item.hp }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.state }}</td>
            </tr>
          </tbody>
        </template>
      </table>
      <div id="userPagination">
        <paginate class="justify-content-center" v-model="cpage" :page-count="totalPage" :page-range="5" :margin-pages="0"
          :click-handler="userlist" :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'"
          :page-class="'page-item'">
        </paginate>
      </div>
    </div>
  </div>
</template>
<script>
import Paginate from 'vuejs-paginate-next';
import addstudentControllerModal from './addstudentControllerModal.vue';
import { openModal } from 'jenesius-vue-modal';

export default {
  data: function () {
    return {
      select: '',
      search: '',
      radios: '',
      totalcnt: 0,
      totalPage: 0,
      cpage: 0,
      pageSize: 10,
      blockPage: 10,
      listitem: [],
      loginID: '',
      num: '',
      name: '',
      hp: '',
      email: '',
      userend: true,
      usertype: '',
      stumng: false,
      tchmng: false,
      tchlistitem: [],
      tchtotalcnt: 0,
      stulistitem: [],
      stutotalcnt: 0,
    };
  },
  mounted() {
    this.userlist();
  },
  methods: {
    userlist: function (cpage) {
      let vm = this;
      let params = new URLSearchParams();
      this.cpage = cpage || 1;
      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pageSize);
      params.append('select', this.select);
      params.append('search', this.search);
      params.append('radio', this.radios);

      this.axios
        .post('/admin/Vueuserlist.do', params)
        .then(function (response) {
          vm.listitem = response.data.userlist;
          vm.totalcnt = response.data.totalcnt;
          vm.totalPage = vm.page(vm.totalcnt, vm.pageSize);
        })
        .catch(function (error) {
          alert('에러! API요청에 오류가 있습니다.' + error);
        });
    },
    modalOpen: async function (usertype, loginID) {
      let paramtitle = "";
      if (usertype == 'B') {
        paramtitle = "강사관리";
      } else if (usertype == 'C') {
        paramtitle = "미승인 강사관리";
      } else {
        paramtitle = "학생관리";
      }
      const modal = await openModal(addstudentControllerModal, {
        ptitle: paramtitle,
        ploginID: loginID,
        pusertype: usertype,
      });
      modal.onclose = (popupparam) => {
        console.log('Close :' + popupparam);
        this.userlist(this.cpage);
      };
    },
    page: function (totalcnt, pageSize) {
      var xx = totalcnt % pageSize;
      var result = parseInt(totalcnt / pageSize);

      if (xx == 0) {
        return result;
      } else {
        result += 1;
        return result;
      }
    },
  },
  computed: {},
  components: {
    Paginate: Paginate,
  },
};
</script>
