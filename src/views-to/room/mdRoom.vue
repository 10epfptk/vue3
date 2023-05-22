<template>
  <div id="mdRoom" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>{{ ptitle }}</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row" style="margin: auto; display: table">
          <colgroup>
            <col width="150px" />
            <col width="*" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row" style="padding-left: 6px">
                강의실 명 <span class="font_red">*</span>
              </th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="roomname"
                  id="roomname"
                  v-model="roomname"
                />
              </td>
            </tr>
            <tr>
              <th scope="row" style="padding-left: 6px">자릿수</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="pper"
                  id="pper"
                  v-model="pper"
                />
              </td>
            </tr>
            <tr>
              <th scope="row" style="padding-left: 6px">비고</th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  name="nt"
                  id="nt"
                  v-model="nt"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a href="" class="btnType blue" @click.prevent="fn_saveroom()"
            ><span>저장</span></a
          >
          <a
            href=""
            class="btnType blue"
            id="btnDeleteroom"
            name="btn"
            v-show="show"
            @click.prevent="deletecon()"
            ><span>삭제</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnCloseroom"
            name="btn"
            @click.prevent="fn_close()"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>
<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    ptitle: String,
    prmseq: String,
    prmyn: String,
    paction: String,
  },
  data: function () {
    return {
      roomname: '',
      pper: '',
      nt: '',
      use_yn: 'N',
      title: '',
      rmseq: '',
      rmyn: '',
      action: '',
      show: false,
      cnt: 0,
    };
  },
  mounted() {
    this.title = this.ptitle;
    this.rmseq = this.prmseq;
    this.rmyn = this.prmyn;
    this.action = this.paction;

    console.log(this.ptitle);
    console.log(this.prmseq);
    console.log(this.rmyn);
    console.log(this.paction);

    if (this.action == 'I') {
      // 1. 첫번째 방식
      //this.roomname = '';
      //this.pper = '';
      //this.nt = '';
      // 2 두번째 방식
      this.init();
    } else {
      this.selectroom();
    }
  },
  methods: {
    init: function (object) {
      if (this.action == 'I') {
        this.roomname = '';
        this.pper = '';
        this.nt = '';
        this.use_yn = 'N';
        this.show = false;
      } else {
        this.roomname = object.rm_name;
        this.pper = object.rm_pper;
        this.nt = object.rm_nt;
        this.use_yn = object.rm_yn;
        this.show = true;
      }
    },
    selectroom: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('rmseq', this.rmseq);

      this.axios
        .post('/room/roomselect.do', params)
        .then(function (response) {
          console.log(response);
          vm.cnt = response.data.cnt;
          // 1. 첫번째 방식 (init 함수가 필요없음)
          //vm.roomname = response.data.roominfo.rm_name;
          //vm.pper = response.data.roominfo.rm_pper;
          //vm.nt = response.data.roominfo.rm_nt;
          // 2 두번째 방식
          vm.init(response.data.roominfo);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_close: function () {
      closeModal(this);
    },
    fn_saveroom: function () {
      let vm = this;

      let params = new URLSearchParams();

      this.show = true;

      params.append('roomid', this.rmseq);
      params.append('roomname', this.roomname);
      params.append('pper', this.pper);
      params.append('nt', this.nt);
      params.append('use_yn', this.use_yn);
      params.append('action', this.action);

      //console.log('d 액션' + this.action);

      this.axios
        .post('/room/roomsave.do', params)
        .then(function (response) {
          console.log(response);

          if (response.status == '200') {
            alert('저장 되었습니다.');
            vm.fn_close(); // axios 안에 있으니까 this.으로 부르는게 아닌 vm.으로 부름
          }
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    deletecon: function () {
      if (this.cnt > 0 || this.use_yn == 'Y') {
        alert('장비가 존재하거나 사용중인 강의실입니다.');
        return;
      }
      this.action = 'D';

      this.fn_saveroom();
    },
  },
};
</script>
