<template>
  <div id="md_Item" class="layerPop layerType2" style="width: 600px">
    <dl>
      <dt>
        <strong>{{ ttitle }}</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->

        <table class="row" style="margin-left: 12px; width: 95%">
          <!-- <caption>
            caption
          </caption> -->
          <!-- <colgroup>
            <col width="*" />
            <col width="120px" />
            <col width="120px" />
            <col width="120px" />
          </colgroup> -->

          <tbody>
            <tr>
              <th scope="row">강의실코드 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="iroomid"
                  id="iroomid"
                  v-model="iroomid"
                  readonly
                />
              </td>
              <th scope="row">강의실 명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="iroomname"
                  id="iroomname"
                  v-model="iroomname"
                  readonly
                />
              </td>
            </tr>
            <tr>
              <th scope="row">장비코드<span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="itemcode"
                  name="itemcode"
                  v-model="itemcode"
                  readonly
                />
              </td>
              <th scope="row">장비명 <span class="font_red">*</span></th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="itemname"
                  name="itemname"
                  v-model="itemname"
                />
              </td>
            </tr>

            <tr>
              <th scope="row">수량</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="vol"
                  name="vol"
                  v-model="vol"
                  onkeydown="fFilterNumber(event);"
                />
              </td>
              <th scope="row">비고</th>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  id="itnt"
                  name="itnt"
                  v-model="itnt"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a
            href=""
            class="btnType blue"
            id="btnSaveitem"
            name="btn"
            @click.prevent="fn_saveitem()"
            ><span>저장</span></a
          >
          <a
            href=""
            class="btnType blue"
            id="btnDeleteitem"
            name="btn"
            v-show="ishow"
            @click.prevent="deleteItemCon()"
            ><span>삭제</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnCloseitem"
            name="btn"
            @click.prevent="fn_close2()"
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
    ttitle: String,
    troomid: String,
    troomname: String,
    titemcode: Number,
    taction: String,
  },
  data: function () {
    return {
      iroomid: '', //강의실 코드
      iroomname: '', //강의실명
      itemcode: '', //장비코드
      itemname: '', //장비명
      vol: '', //수량
      itnt: '', //비고

      title: '',
      //rmseq: '',
      iaction: '',
      ishow: false, //hide, 삭제 버튼 숨기기
    };
  },
  mounted() {
    this.title = this.ttitle;
    this.iroomid = this.troomid;
    this.iroomname = this.troomname;
    this.itemcode = this.titemcode;
    this.iaction = this.taction;

    console.log('~~~~~~~~~~~~');
    console.log(this.ttitle);
    console.log(this.troomid);
    console.log(this.troomname);
    console.log(this.titemcode);
    console.log(this.taction);

    if (this.iaction == 'I') {
      this.itemcode = '';
      this.itemname = '';
      this.vol = '';
      this.itnt = '';
      //this.init();
    } else {
      this.selectitem();
    }
  },
  methods: {
    init: function (object) {
      if (this.iaction == 'I') {
        this.itemcode = '';
        this.itemname = '';
        this.vol = '';
        this.itnt = '';
        this.ishow = false;
      } else {
        this.itemcode = object.item_seq;
        this.itemname = object.item_name;
        this.vol = object.item_vol;
        this.itnt = object.item_nt;
        this.ishow = true;
      }
    },
    selectitem: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append('rmseq', this.iroomid);
      params.append('itemseq', this.itemcode);

      console.log('수정버튼 클릭시 넘어올 정보');
      console.log(this.iroomid); //강의실코드
      console.log(this.itemcode);

      this.axios
        .post('/room/itemselect.do', params)
        .then(function (response) {
          console.log(response);

          // 1. 첫번째 방식 (init 함수가 필요없음)
          //vm.iroomid = response.data.iteminfo.rm_seq; //강의실코드
          // vm.itemcode = response.data.iteminfo.item_seq; //장비코드
          // vm.itemname = response.data.iteminfo.item_name; //장비명
          // vm.vol = response.data.iteminfo.item_vol; //수량
          // vm.itnt = response.data.iteminfo.item_nt; //비고
          // 2 두번째 방식
          vm.init(response.data.iteminfo);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_close2: function () {
      closeModal(this);
    },
    fn_saveitem: function () {
      let vm = this;

      let params = new URLSearchParams();

      params.append('rmseq', this.iroomid); //강의실코드
      params.append('itemseq', this.itemcode); //장비코드
      params.append('itemname', this.itemname); //장비명
      params.append('vol', this.vol); //장비수량
      params.append('nt', this.itnt); //장비비고
      params.append('action', this.iaction);

      this.axios
        .post('/room/itemsave.do', params)
        .then(function (response) {
          console.log(response);

          if (response.status == '200') {
            alert('저장 되었습니다.');
            vm.fn_close2(); // axios 안에 있으니까 this.으로 부르는게 아닌 vm.으로 부름
          }
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    deleteItemCon: function () {
      this.iaction = 'D';
      this.fn_saveitem();
    },
  },
};
</script>
