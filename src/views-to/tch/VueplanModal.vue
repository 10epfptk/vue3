<template>
  <div id="layer1" class="layerPop layerType2" style="width: 800px">
    <dl>
      <dt>
        <strong>주간 계획 변경</strong>
      </dt>
      <dd class="content">
        <!-- s : 여기에 내용입력 -->
        <table class="row" style="margin: auto; display: table">
          <!-- <caption>
            caption
          </caption>
          <colgroup>
            <col width="100px" />
            <col width="*" />
            <col width="*" />
          </colgroup> -->
          <tbody>
            <tr>
              <th scope="row">주차 <span class="font_red">*</span></th>
              <th scope="row">내용 <span class="font_red">*</span></th>
              <th scope="row">목표 <span class="font_red">*</span></th>
            </tr>
            <tr>
              <td>{{ lecWeek }}주차</td>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="plan_cont"
                  id="plan_cont"
                  v-model="lecCont"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="inputTxt p100"
                  name="plan_goal"
                  id="plan_goal"
                  v-model="lecGl"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- e : 여기에 내용입력 -->

        <div class="btn_areaC mt30">
          <a href="" class="btnType blue" @click.prevent="planUpdate" name="btn"
            ><span>수정</span></a
          >
          <a
            href=""
            class="btnType gray"
            id="btnClose"
            name="btn"
            @click.prevent="cancelModal"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
    <a href="" class="closePop" @click.prevent="cancelModal"
      ><span class="hidden">닫기</span></a
    >
  </div>
</template>

<script>
import { closeModal } from 'jenesius-vue-modal';

export default {
  props: {
    mTitle: String,
    mLecWeek: String,
    mLecSeq: Number,
  },
  data: function () {
    return {
      lecSeq: '',
      lecWeek: '',
      lecCont: '',
      lecGl: '',
      type: '',
    };
  },
  mounted() {
    this.lecSeq = this.mLecSeq;
    this.lecWeek = this.mLecWeek;
    this.type = 'U';
    this.lecPlanDetail();
  },
  methods: {
    /** 강의계획서 상세 조회 */
    lecPlanDetail: function () {
      let params = new URLSearchParams();
      params.append('lec_week', this.lecWeek);
      params.append('lec_seq', this.lecSeq);

      this.axios
        .post('/tch/plansearch.do', params)
        .then((result) => {
          console.log('강의계획서 상세');
          console.log(result);
          this.lecCont = result.data.legplan.lec_cont;
          this.lecGl = result.data.legplan.lec_gl;
        })
        .catch((error) => {
          console.log(`lecPlanDetail() 에러: ${error}`);
        });
    },
    /** 강의계획서 U */
    planUpdate: function () {
      this.$swal
        .fire({
          text: '강의계획서를 수정하시겠습니까?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          reverseButtons: false,
        })
        .then((data) => {
          if (data.isConfirmed) {
            let params = new URLSearchParams();
            params.append('type', this.type);
            params.append('lec_seq', this.lecSeq);
            params.append('lec_week', this.lecWeek);
            params.append('lec_cont', this.lecCont);
            params.append('lec_goal', this.lecGl);

            this.axios
              .post('/tch/plansave.do', params)
              .then((result) => {
                this.$swal(result.data.msg);
                closeModal(this);
              })
              .catch((error) => {
                alert(`planUpdate() 에러: ${error}`);
              });
          } else {
            this.$swal('취소되었습니다.', {
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '확인',
            });
          }
        });
    },
    /** 모달 임의로 닫기 */
    cancelModal: function () {
      closeModal(this);
    },
  },
};
</script>

<style></style>
