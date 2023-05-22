<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">학습 지원</span>
      <span class="btn_nav bold">강의 목록</span>
    </p>

    <p class="conTitle"><span>강의 목록</span> <span class="fr"> </span></p>

    <div id="leclist">
      <table class="col">
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="20%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">강의 이름</th>
            <th scope="col">진행 날짜</th>
            <th scope="col">시험</th>
            <th scope="col">인원 현황</th>
            <th scope="col">비고</th>
          </tr>
        </thead>
        <template v-if="totalCnt == 0">
          <tbody>
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="item in lecListItem" :key="item.lec_seq">
            <tr>
              <td>
                <a href="" @click.prevent="lecDetail(item.lec_seq)">{{
                  item.lec_name
                }}</a>
              </td>
              <td>{{ item.lec_st }} ~ {{ item.lec_ed }}</td>
              <td>{{ item.test_name }}</td>
              <td>{{ item.lec_now }}/{{ item.lec_max }}</td>

              <!-- template 시작 -->
              <template v-if="item.lec_now != item.lec_max">
                <template v-if="item.regi_state == 0">
                  <!-- 수강신청 안했을때 -->
                  <template v-if="item.now >= item.lec_st">
                    <td>
                      <span class="font_red">신청불가</span>
                    </td>
                  </template>
                  <template v-if="item.now < item.lec_st">
                    <td>
                      <a
                        class="btnType3 color2"
                        href=""
                        @click.prevent="lecUpdate(item.lec_seq, 'I')"
                        >수강 신청</a
                      >
                    </td>
                  </template>
                </template>
                <template v-if="item.regi_state == 1">
                  <!-- 수강신청 했을때 -->
                  <template v-if="item.now >= item.lec_st">
                    <td>
                      <span class="font_red">취소불가</span>
                    </td>
                  </template>
                  <template v-if="item.now < item.lec_st">
                    <td>
                      <a
                        class="btnType3 color1"
                        href=""
                        @click.prevent="lecUpdate(item.lec_seq, 'D')"
                        >수강 취소</a
                      >
                    </td>
                    <template v-if="item.lec_now == item.lec_max">
                      <td>모집완료</td>
                    </template>
                  </template>
                </template>
              </template>
              <!-- v-if 1 끝-->
              <template v-if="item.lec_now == item.lec_max">
                <template v-if="item.regi_state != 1">
                  <!-- 다 찼는데 수강신청을 않했을 때 -->
                  <td>모집완료</td>
                </template>
                <template v-if="item.regi_state == 1">
                  <!-- 다 찼는데 수강신청을 했을 때 -->
                  <td>
                    <a
                      class="btnType3 color1"
                      href=""
                      @click.prevent="lecUpdate(item.lec_seq, 'D')"
                      >수강 취소</a
                    >
                  </td>
                </template>
              </template>

              <!-- template끝 -->
            </tr>
          </tbody>
        </template>
      </table>
      <div>
        <div class="paging_area" id="leclistPagination">
          <paginate
            class="justify-content-center"
            v-model="currentPage"
            :page-count="totalPage"
            :page-range="5"
            :margin-pages="0"
            :click-handler="readLecList"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
          >
          </paginate>
        </div>
      </div>
    </div>

    <br /><br />
    <div id="lecinfo" v-show="lecInfoShow">
      <p class="conTitle">
        <span>강의 정보</span>
        <span class="fr"> </span>
      </p>
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="15%" />
          <col width="10%" />
          <col width="20%" />
          <col width="15%" />
          <col width="20%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">강의 이름</th>
            <th scope="col">과정일수</th>
            <th scope="col">강사명</th>
            <th scope="col">연락처</th>
            <th scope="col">이메일</th>
            <th scope="col">시험</th>
            <th scope="col">강의실</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-html="lecName"></td>
            <td v-html="lecDays"></td>
            <td v-html="tchName"></td>
            <td v-html="tchHp"></td>
            <td v-html="tchEmail"></td>
            <td v-html="testName"></td>
            <td v-html="roomName"></td>
          </tr>
        </tbody>
      </table>
      <table class="col">
        <colgroup>
          <col width="20%" />
          <col width="40%" />
          <col width="40%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">강의 내용</th>
            <th scope="col">강의 목표</th>
          </tr>
        </thead>
        <template v-if="dTotalCnt == 0">
          <tbody>
            <tr>
              <td colspan="3">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody v-for="(item, index) in lecDetailItem" :key="index">
            <tr>
              <td>{{ item.lec_week }}주차</td>
              <td>{{ item.lec_cont }}</td>
              <td>{{ item.lec_gl }}</td>
            </tr>
          </tbody>
        </template>
      </table>
      <div id="lecPlanPagination" class="paging_area">
        <paginate
          class="justify-content-center"
          v-model="dCurrentPage"
          :page-count="dTotalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="lecPlanDetail"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>
    </div>
  </div>
</template>

<script>
import paginate from 'vuejs-paginate-next';

export default {
  data: function () {
    return {
      //lecList
      lecListItem: [],
      totalCnt: 0,
      currentPage: 1,
      totalPage: 1,
      pageSize: 5,
      blockSize: 10,

      //강의 계획서 리스트
      lecInfoShow: false,
      lecDetailItem: [],
      dTotalCnt: 0,
      dCurrentPage: 1,
      dTotalPage: 1,
      dPageSize: 5,
      dBlockSize: 10,
      lecName: '',
      lecDays: '',
      tchName: '',
      tchHp: '',
      tchEmail: '',
      testName: '',
      roomName: '',
    };
  },
  mounted() {
    this.readLecList();
  },
  components: {
    paginate: paginate,
  },
  methods: {
    /** 강의 목록 조회 */
    readLecList: function () {
      this.lecInfoShow = false;
      let params = new URLSearchParams();
      console.log(`currentPage: ${this.currentPage}`);
      params.append('pageSize', this.pageSize);
      params.append('pagenum', this.currentPage);

      this.axios
        .post('/stu/Vueleclist.do', params)
        .then((response) => {
          console.log('강의 목록');
          console.log(response);

          this.lecListItem = response.data.leclist;
          this.totalCnt = response.data.leclistcnt;
          this.totalPage = this.page(this.totalCnt, this.pageSize);
        })
        .catch((error) => {
          alert('lecList() 에러: ' + error);
        });
    },
    /** 강의 정보 */
    lecDetail: function (lecSeq) {
      this.lecSeq = lecSeq; // 강의 번호 저장
      let params = new URLSearchParams();

      params.append('lec_seq', this.lecSeq);

      this.axios
        .post('/stu/lecinfo.do', params)
        .then((result) => {
          console.log('강의 상세');
          console.log(result);
          this.lecName = result.data.lecinfo.lec_name;
          this.lecDays = result.data.lecinfo.lec_days;
          this.tchName = result.data.lecinfo.tch_name;
          this.tchHp = result.data.lecinfo.tch_hp;
          this.tchEmail = result.data.lecinfo.tch_email;
          this.testName = result.data.lecinfo.test_name;
          this.roomName = result.data.lecinfo.rm_name;
          this.lecPlanDetail();
          this.lecInfoShow = true;
        })
        .catch((error) => {
          alert('lecDetail() 강의 상세 에러: ' + error);
        });
    },
    /** 강의 계획서 */
    lecPlanDetail: function (pageNum) {
      this.dCurrentPage = pageNum || 1;
      let params = new URLSearchParams();
      params.append('lec_seq', this.lecSeq);
      params.append('pagenum', this.dCurrentPage);
      params.append('pageSize', this.dPageSize);
      this.axios
        .post('/stu/VueNpmlecplanlist.do', params)
        .then((result) => {
          console.log('강의 계획서');
          console.log(result);
          this.lecDetailItem = result.data.lecplanlist;
          this.dTotalCnt = result.data.lecplanlistcnt;
          this.dTotalPage = this.page(this.dTotalCnt, this.dPageSize);
        })
        .catch((error) => {
          alert('lecDetail() 강의 계획서 에러: ' + error);
        });
    },
    /** 수강 신청 or 취소 */
    lecUpdate: function (lecSeq, action) {
      this.lecSeq = lecSeq;
      let text;
      let path;

      if (action === 'I') {
        text = '신청';
        path = '/stu/lecrag.do';
      } else if (action === 'D') {
        text = '취소';
        path = '/stu/leccen.do';
      }
      this.$swal
        .fire({
          text: `수강을 ${text}하시겠습니까?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '확인',
          cancelButtonText: '취소',
          reverseButtons: false, // 버튼 순서 거꾸로
        })
        .then((data) => {
          if (data.isConfirmed) {
            let params = new URLSearchParams();
            params.append('lec_seq', this.lecSeq);
            this.axios
              .post(path, params)
              .then((result) => {
                console.log(result.data.result);
                if (result.data.result > 0) {
                  this.$swal(`수강${text} 완료되었습니다.`);
                  this.readLecList();
                } else {
                  this.$swal('오류가 발생했습니다.');
                }
              })
              .catch((error) => {
                alert('lecUpdate() 오류: ' + error);
              });
          } else {
            this.$swal(`수강${text} 실패하였습니다.`);
          }
        });
    },
    /**페이징 */
    page: function (total, page) {
      let remainder = total % page;
      let pageCnt = parseInt(total / page);
      if (remainder == 0) {
        return pageCnt;
      } else {
        return (pageCnt += 1);
      }
    },
  },
};
</script>

<style></style>
