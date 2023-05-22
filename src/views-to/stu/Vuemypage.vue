<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">학습관리</span>
      <span class="btn_nav bold">개인정보수정탈퇴</span>
    </p>

    <p class="conTitle">
      <span>마이 페이지 </span>
    </p>

    <div id="userinfoarea">
      <table class="row" style="display: table; margin: auto;">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="120px" />
          <col width="*" />
          <col width="120px" />
          <col width="*" />
        </colgroup>

        <tbody>
          <tr>
            <th scope="row" style="width: 70px">아이디</th>
            <td>
              <input type="text" name="rloginID" id="rloginID" readonly="readonly" style="border: none; outline: none"
                v-model="rloginID" />
            </td>

            <th style="width: 70px" scope="row">
              비밀번호<span class="font_red">*</span>
            </th>
            <td>
              <input type="password" name="password" id="password" v-model="password" />
            </td>
          </tr>

          <tr>
            <th scope="row">연락처 <span class="font_red">*</span></th>
            <td>
              <input style="width: 160px" type="text" id="hp" name="hp" v-model="hp" />
            </td>
            <th style="width: 70px" scope="row">
              비밀번호 확인<span class="font_red">*</span>
            </th>
            <td>
              <input type="password" name="repassword" id="repassword" v-model="repassword" />
            </td>
          </tr>

          <tr>
            <th scope="row" style="width: 70px">
              이름<span class="font_red">*</span>
            </th>
            <td>
              <input type="text" name="name" id="name" v-model="name" />
            </td>

            <th scope="row">이메일</th>
            <td style="width: 30%">
              <input type="text" name="email" id="email" size="30" v-model="email" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="btn_areaC mt30">
        <a href="" class="btnType blue" id="btnUpdateUser" name="btn" @click.prevent="UpdateUser('U')"><span>정보
            수정</span></a>
        <a href="" class="btnType blue" id="btnDeleteUser" name="btn" @click.prevent="UpdateUser('D')"><span>회원
            탈퇴</span></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      rloginID: '',
      password: '',
      hp: '',
      repassword: '',
      name: '',
      email: '',
    };
  },
  mounted() {
    this.DetailUser();
  },
  methods: {
    DetailUser: function () {
      let vm = this;
      let params = new URLSearchParams();

      this.axios.post('/stu/DetailUser.do', params).then(function (response) {
        console.log(response);
        vm.rloginID = response.data.result.loginID;
        vm.password = response.data.result.password;
        vm.hp = response.data.result.hp;
        vm.repassword = '';
        vm.name = response.data.result.name;
        vm.email = response.data.result.email;
      });
    },
    UpdateUser: function (action) {
      let vm = this;
      if (this.password != this.repassword) {
        alert('비밀번호를 다시 확인해 주세요!!');
        return;
      }
      if (this.name == '' || this.name == null) {
        alert('이름을 입력해주세요!!');
        return;
      }
      if (this.hp == '' || this.hp == null) {
        alert('연락처를 입력하세요!!');
        return;
      }
      if (this.email == '' || this.email == null) {
        alert('이메일을 입력하세요!!');
        return;
      }

      let params = new URLSearchParams();

      params.append('action', action);
      params.append('name', this.name);
      params.append('password', this.password);
      params.append('hp', this.hp);
      params.append('email', this.email);

      this.axios.post('/stu/UpdateUser.do', params).then(function (response) {
        if (action == 'D') {
          vm.$swal
            .fire(response.data.resultMsg, '', 'success')
            .then((result) => {
              if (result.isConfirmed) {
                vm.$router.push('/#');
              }
            });
        } else {
          alert(response.data.resultMsg);
        }
      });
    },
  },
};
</script>
