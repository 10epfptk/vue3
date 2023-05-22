<template>
  <div id="layer1" class="layerPop layerType2" style="width: 800px">
    <dl>
      <dt>
        <strong v-text="title"></strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <div v-show="stumng">
          <p class="conTitle" v-show="stumng">
            <span>수강 내역 </span>
            <span class="fr"></span>
          </p>
          <table class="row" id="stuleclist">
            <tbody>
              <tr>
                <th scope="row">강의명</th>
                <th scope="row">담당강사</th>
                <th scope="row">기간</th>
                <th scope="row">현황</th>
                <th scope="row">비고</th>
              </tr>
            </tbody>
            <tbody v-if="stutotalcnt == 0">
              <tr>
                <td colspan="5" align="center">조회된 데이터가 없습니다.</td>
              </tr>
            </tbody>
            <template v-else>
              <tbody
                v-for="item in stulistitem"
                :key="item.loginID"
                align="center"
              >
                <tr>
                  <td>{{ item.lec_name }}</td>
                  <td>{{ item.tch_name }}</td>
                  <td>{{ item.lec_st }} ~ {{ item.lec_ed }}</td>
                  <td>{{ item.lec_now }}/{{ item.lec_max }}</td>
                  <td>
                    <a
                      class="btnType blue"
                      href=""
                      @click.prevent="stucancell(item.lec_seq)"
                      ><span>수강 취소</span></a
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
          <br /><br />
        </div>

        <div v-show="tchmng">
          <p class="conTitle">
            <span>강의 내역 </span> <span class="fr"></span>
          </p>
          <table class="row" id="tchleclist">
            <tbody>
              <tr>
                <th scope="row">강의명</th>
                <th scope="row">강의실</th>
                <th scope="row">과정일</th>
                <th scope="row">강의 진행 상태</th>
              </tr>
            </tbody>
            <template v-if="tchtotalcnt == 0">
              <tbody>
                <tr>
                  <td colspan="4" align="center">조회된 데이터가 없습니다.</td>
                </tr>
              </tbody>
            </template>
            <template v-else>
              <tbody
                v-for="item in tchlistitem"
                :key="item.loginID"
                align="center"
              >
                <tr>
                  <td>{{ item.lec_name }}</td>
                  <td>{{ item.rm_name }}</td>
                  <td>{{ item.lec_days }}</td>
                  <td>{{ item.state }}</td>
                </tr>
              </tbody>
            </template>
          </table>
          <br /><br />
        </div>

        <table class="row" id="sharelist">
          <caption>
            caption
          </caption>
          <!-- 학생일 때 -->
          <colgroup v-if="usertype == 'D'">
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="25%" />
            <col width="30%" />
          </colgroup>
          <!-- 강사일 때 -->
          <colgroup v-else-if="usertype == 'B'">
            <col width="100px" />
            <col width="100px" />
            <col width="*" />
            <col width="*" />
          </colgroup>
          <!-- 미승인 강사일 때 -->
          <colgroup v-else>
            <col width="20%" />
            <col width="17%" />
            <col width="22%" />
            <col width="25%" />
            <col width="15%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">loginID</th>
              <th scope="row" v-if="usertype == 'D'">학번</th>
              <th scope="row">이름</th>
              <th scope="row">전화번호</th>
              <th scope="row">이메일</th>
              <th scope="row" v-if="usertype == 'C'">승인</th>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="loginID"
                  id="loginID"
                  v-model="loginID"
                  readonly="readonly"
                  style="border: none; outline: none"
                />
              </td>
              <td v-if="usertype == 'D'">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="num"
                  id="num"
                  v-model="num"
                  readonly="readonly"
                  style="border: none; outline: none"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="name"
                  id="name"
                  v-model="name"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="hp"
                  id="hp"
                  v-model="hp"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="email"
                  id="email"
                  v-model="email"
                />
              </td>
              <td v-if="usertype == 'C'">
                <a class="btnType blue" href="" @click.prevent="tchappr()"
                  ><span>강사 승인</span></a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <!-- e : 여기에 내용입력 -->
        <div class="btn_areaC mt30">
          <span id="s_end" v-show="userend">
            <a href="" class="btnType blue" @click.prevent="fn_usersave('U')"
              ><span>수정</span></a
            >
            <a href="" class="btnType blue" @click.prevent="fn_usersave('D')"
              ><span>삭제</span></a
            >
          </span>
          <a
            class="btnType gray"
            id="btnClose"
            name="btn"
            @click.prevent="close()"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" @click.prevent="close()" class="closePop"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    pusertype: String,
    ploginID: String,
    ptitle: String,
  },
  data: function () {
    return {
      loginID: '',
      num: '',
      name: '',
      hp: '',
      email: '',
      userend: true,
      usertype: '',
      stumng: false,
      tchmng: false,
      tchlistitem: '',
      tchtotalcnt: 0,
      stulistitem: '',
      stutotalcnt: 0,
      title: '',
      action: '',
    };
  },
  mounted() {
    this.loginID = this.ploginID;
    this.usertype = this.pusertype;
    this.title = this.ptitle;
    this.mDetailsearch();
  },
  methods: {
    mDetailsearch: function () {
      let vm = this;
      let params = new URLSearchParams();
      params.append('loginID', this.loginID);
      this.axios
        .post('/admin/detailsearch.do', params)
        .then(function (response) {
          vm.num = response.data.result.stu_num;
          vm.name = response.data.result.name;
          vm.hp = response.data.result.hp;
          vm.email = response.data.result.email;

          if (response.data.result.use_yn == 'N') {
            vm.userend = false;
          } else {
            vm.userend = true;
          }

          if (vm.usertype == 'B') {
            vm.axios
              .post('/admin/Vuetchlist.do', params)
              .then(function (response) {
                vm.tchmng = true;
                vm.stumng = false;
                vm.tchlistitem = response.data.userlist;
                vm.tchtotalcnt = response.data.totalcnt;
              });
          } else if (vm.usertype == 'C') {
            vm.tchmng = false;
            vm.stumng = false;
          } else if (vm.usertype == 'D') {
            vm.axios
              .post('/admin/Vuestulist.do', params)
              .then(function (response) {
                vm.tchmng = false;
                vm.stumng = true;
                vm.stulistitem = response.data.sleclist;
                vm.stutotalcnt = response.data.stutotalcnt;
              });
          }
        });
    },
    tchappr: function () {
      let vm = this;
      Swal.fire({
        text: '해당사용자를 강사로 승인하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '승인',
      }).then((data) => {
        if (data.isConfirmed) {
          let params = new URLSearchParams();
          params.append('loginID', this.loginID);

          this.axios.post('/admin/tchappr.do', params).then(function (result) {
            if (result.data.result > 0) {
              Swal.fire('승인이 완료되었습니다.', {
                icon: 'success',
                cancelButtonText: '확인',
              });
            }
            closeModal(vm);
          });
        }
      });
    },
    fn_usersave: function (action) {
      let check = [
        ['name', '이름을 확인해 주세요'],
        ['hp', '전화번호를 확인해주세요'],
        ['email', '이메일을 확인해 주세요'],
      ];
      this.action = action;
      let vm = this;

      if (action == 'U') {
        if (this.name == '' || this.name == null) {
          return Swal.fire(check[0][1], '', 'error');
        } else if (this.hp == '' || this.hp == null) {
          return Swal.fire(check[1][1], '', 'error');
        } else if (this.email == '' || this.email == null) {
          return Swal.fire(check[2][1], '', 'error');
        }
      }

      let params = new URLSearchParams();
      params.append('name', this.name);
      params.append('hp', this.hp);
      params.append('email', this.email);
      Swal.fire({
        text: '변경 하시겠습니까??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '변경',
      }).then((data) => {
        if (data.isConfirmed) {
          params.append('loginID', this.loginID);
          params.append('type', this.action);
          this.axios
            .post('/admin/usersave.do', params)
            .then(function (response) {
              if (response.data.result > 0) {
                Swal.fire('수정이 완료되었습니다.', {
                  icon: 'success',
                  cancelButtonText: '확인',
                });
                closeModal(vm);
              }
            });
        }
      });
    },
    close: function () {
      closeModal(this);
    },
    stucancell: function (lecseq) {
      let vm = this;
      let params = new URLSearchParams();
      params.append('lec_seq', lecseq);
      params.append('loginID', this.loginID);
      Swal.fire({
        text: '해당강의를 수강취소하시겠습니까??',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '수강취소',
      }).then((data) => {
        if (data.isConfirmed) {
          this.axios
            .post('/admin/stucancell.do', params)
            .then(function (response) {
              if (response.data.result > 0) {
                Swal.fire('수강취소가 완료되었습니다.', {
                  icon: 'success',
                  cancelButtonText: '확인',
                });
                closeModal(vm);
              }
            });
        }
      });
    },
  },
};
</script>
<style>
#stuleclist {
  display: table;
  margin: auto;
}

#stuleclist tbody:nth-child(1) th:nth-child(1) {
  width: 25%;
}

#stuleclist tbody:nth-child(1) th:nth-child(2) {
  width: 15%;
}

#stuleclist tbody:nth-child(1) th:nth-child(3) {
  width: 35%;
}

#stuleclist tbody:nth-child(1) th:nth-child(4) {
  width: 10%;
}

#stuleclist tbody:nth-child(1) th:nth-child(5) {
  width: 15%;
}

#tchleclist {
  display: table;
  margin: auto;
}

#tchleclist tbody:nth-child(1) th:nth-child(1) {
  width: 20%;
}

#tchleclist tbody:nth-child(1) th:nth-child(2) {
  width: 35%;
}

#tchleclist tbody:nth-child(1) th:nth-child(3) {
  width: 15%;
}

#tchleclist tbody:nth-child(1) th:nth-child(4) {
  width: 30%;
}

#sharelist {
  display: table;
  margin: auto;
}
</style>
