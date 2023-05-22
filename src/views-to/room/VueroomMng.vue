<template>
  <div class="content">
    <p class="Location">
      <a href="../dashboard/dashboard.do" class="btn_set home">메인으로</a>
      <span class="btn_nav bold">시설관리</span>
      <span class="btn_nav bold">강의실</span>
      <a href="../room/VueroomMng.do" class="btn_set refresh">새로고침</a>
    </p>
    <!-- ------------------------------------ 강의실 검색 및 신규등록 영역 ----------------- -->
    <p class="conTitle" id="roomsearch">
      <span>강의실</span>
      <span class="fr">
        <ComCombo
          group_code="rm_seq"
          selectid="rmseq"
          type="all"
          selvalue=""
          v-model="searchrmseq"
          @change="selchange"
          ref="Com_combo"
          @send-message="sendmessage"
        ></ComCombo>

        자릿수
        <input
          type="text"
          style="width: 300px; height: 25px"
          id="seatcnt"
          name="seatcnt"
          v-model="seatcnt"
        />
        <a
          href=""
          class="btnType blue"
          id="btnSearch"
          name="btn"
          @click.prevent="fn_roomList()"
          ><span>검 색</span></a
        >
        <a
          href=""
          class="btnType blue"
          @click.prevent="fn_mdRoomnew()"
          name="modal"
          ><span>신규등록</span></a
        >
      </span>
    </p>
    <!-- ------------------------------------ 강의실 리스트 ----------------- -->
    <div id="roomList">
      <div>
        <table class="col">
          <caption>
            caption
          </caption>
          <colgroup>
            <col width="10%" />
            <col width="60%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>

          <thead>
            <tr>
              <th scope="col">강의실코드</th>
              <th scope="col">강의실명</th>
              <th scope="col">자릿수</th>
              <th scope="col">사용여부</th>
              <th scope="col">수정</th>
            </tr>
          </thead>

          <template v-if="totalcnt === 0">
            <tbody>
              <tr>
                <td colspan="5">데이터가 존재하지 않습니다.</td>
              </tr>
            </tbody>
          </template>

          <template v-else>
            <tbody v-for="item in rmlist" :key="item.rm_seq">
              <tr>
                <td>{{ item.rm_seq }}</td>
                <td>
                  <a
                    href=""
                    @click.prevent="rm_name(item.rm_seq, item.rm_name)"
                    id="rm_name"
                    >{{ item.rm_name }}</a
                  >
                </td>
                <td>{{ item.rm_pper }}</td>
                <td>{{ item.rm_yn }}</td>
                <td>
                  <a
                    class="btnType3 color1"
                    href=""
                    @click.prevent="fn_edit(item.rm_seq, item.rm_yn)"
                    ><span>수정</span></a
                  >
                </td>
                <!-- item의  rm_seq는 위에 data를 해당화면 콘솔창에서 확인했을 때 value에 해당하는 배열 안에 각 컬럼들이 있는데 그 컬럼명과 동일하게 적어줌 -->
              </tr>
            </tbody>
          </template>
        </table>
      </div>
      <!-- 페이징 구간 -->
      <div id="roomlistPagination">
        <paginate
          class="justify-content-center"
          v-model="cpage"
          :page-count="totalPage"
          :page-range="5"
          :margin-pages="0"
          :click-handler="fn_roomList"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
        >
        </paginate>
      </div>
    </div>
    <!-- div id="roomList" 영역 끝 -->
    <!-- ------------------------------------ 장비 신규등록 영역 ----------------- -->
    <br />
    <div v-show="show">
      <p class="conTitle">
        <span>장비</span>
        <span class="fr">
          <a
            class="btnType blue"
            href=""
            name="modal"
            @click.prevent="fn_mdItemnew()"
            ><span>신규등록</span></a
          >
        </span>
      </p>

      <!-- ------------------------------------ 장비 리스트 ----------------- -->
      <div id="itemList">
        <div>
          <table class="col">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="10%" />
              <col width="70%" />
              <col width="10%" />
              <col width="10%" />
            </colgroup>

            <thead>
              <tr>
                <th scope="col">장비코드</th>
                <th scope="col">장비명</th>
                <th scope="col">수량</th>
                <th scope="col">수정</th>
              </tr>
            </thead>

            <template v-if="itemtotalcnt == 0">
              <tbody>
                <tr>
                  <td colspan="4">데이터가 존재하지 않습니다.</td>
                </tr>
              </tbody>
            </template>

            <template v-else>
              <tbody v-for="list in itlist" :key="list.item_seq">
                <tr>
                  <td>{{ list.item_seq }}</td>
                  <td>{{ list.item_name }}</td>
                  <td>{{ list.item_vol }}</td>
                  <td>
                    <a
                      class="btnType3 color1"
                      href=""
                      @click.prevent="fn_listedit(list.item_seq)"
                      id="list_name"
                      ><span>수정</span></a
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>

        <!-- 페이징 처리 영역 -->
        <div id="itemlistPagination">
          <paginate
            class="justify-content-center"
            v-model="ipage"
            :page-count="itemtotalPage"
            :page-range="5"
            :margin-pages="0"
            :click-handler="fn_itemList"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :container-class="'pagination'"
            :page-class="'page-item'"
          >
          </paginate>
        </div>
      </div>
      <!-- <div id="itemList"> 영역 끝 -->
    </div>
  </div>
  <!-- div content 영역 끝 -->
</template>
<script>
import ComCombo from '@/components/common/ComCombo.vue';
import { openModal } from 'jenesius-vue-modal';
import mdRoom from './mdRoom.vue';
import mdItem from './mdItem.vue';
import Paginate from 'vuejs-paginate-next';
//import func from 'vue-editor-bridge';

export default {
  data: function () {
    return {
      rmlist: [],
      totalcnt: 0,
      cpage: 1,
      pageSizeRoom: 5,
      pageBlockRoom: 10,
      roomlistPagination: '',
      totalPage: '',

      rmseq: '',

      searchrmseq: '', //검색시 저장될 rmseq 변수명
      seatcnt: '',

      action: '',
      prmseq: '',
      rmyn: '', //string타입이므로 ''으로 선언
      roomid: '',
      roomname: '',
      pper: '',
      use_yn: 'N',
      nt: '',
      //아래 코드는 default를 false로 줘서 디폴트로 삭제버튼이 hide되게 코드 작성
      show: false,

      itlist: [],
      itemtotalcnt: 0,
      ipage: 1,
      pageSizeItem: 5,
      pageBlockItem: 10,
      itemtotalPage: '',
      //rmseq: '',
      irmname: '',

      iroomid: '', //강의실 코드
      iroomname: '', //강의실명
      itemcode: '', //장비코드
      itemname: '', //장비명
      vol: '', //수량
      itnt: '', //비고
      iaction: '',
      //show: false, //hide, 삭제 버튼 숨기기
    };
  },
  components: {
    ComCombo,
    paginate: Paginate,
  },
  mounted() {
    this.fn_roomList();
  },
  methods: {
    fn_roomList: function (resetpage) {
      let vm = this;

      // if (resetpage == 1) {
      //   this.cpage = resetpage;
      // }

      let params = new URLSearchParams();

      this.cpage = resetpage || 1;

      params.append('pagenum', this.cpage);
      params.append('pageSize', this.pageSizeRoom);
      params.append('rmseq', this.searchrmseq); //강의실코드 pk, 강의실 값 가져오기 -input에서 v-model작성하기
      params.append('seatcnt', this.seatcnt);

      this.axios
        .post('/room/Vueroomlist.do', params)
        .then(function (response) {
          console.log(response);
          vm.totalcnt = response.data.totalCnt;
          vm.rmlist = response.data.roomlist;
          vm.totalPage = vm.page(vm.totalcnt, vm.pageSizeRoom);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_edit: function (rmseq, rmyn) {
      this.prmseq = rmseq;
      this.rmyn = rmyn;
      this.action = 'U';

      this.fn_mdRoom();
    },
    fn_mdRoomnew: function () {
      this.action = 'I';
      this.fn_mdRoom();
    },
    fn_mdRoom: async function () {
      let paramtitle = '';

      if (this.action == 'I') {
        paramtitle = '강의실 등록';
      } else {
        paramtitle = '강의실 수정';
      }

      const modal = await openModal(mdRoom, {
        ptitle: paramtitle,
        prmseq: this.prmseq,
        prmyn: this.rmyn,
        paction: this.action,
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        this.fn_roomList();
        //return false; //Modal will not be closed
      };
    },
    rm_name: function (rmseq, rmname) {
      this.rmseq = rmseq;
      this.irmname = rmname;
      this.fn_itemList();
    },
    fn_itemList: function (resetPage) {
      let vm = this;

      let params = new URLSearchParams();

      this.show = true; //강의실 리스트에서 강의실명 누르면 장비 리스트 보이도록 v-show 작업
      this.ipage = resetPage || 1;

      params.append('pagenum', this.ipage);
      params.append('pageSize', this.pageSizeItem);
      params.append('rmseq', this.rmseq);

      this.axios
        .post('/room/Vueitemlist.do', params)
        .then(function (response) {
          console.log('###################' + JSON.stringify(response));
          vm.itemtotalcnt = response.data.totalCnt;
          vm.itlist = response.data.itemlist;
          vm.itemtotalPage = vm.page(vm.itemtotalcnt, vm.pageSizeItem);
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error);
        });
    },
    fn_listedit: function (itemseq) {
      this.itemcode = itemseq; //장비코드
      this.iaction = 'U'; //장비모달 수정

      this.fn_mdItem();

      console.log('~~~~~~~~~~~~~~~~~~~' + this.irmname);
    },

    fn_mdItemnew: function () {
      this.iaction = 'I';
      this.fn_mdItem();
    },
    fn_mdItem: async function () {
      let paramtitle = '';

      if (this.iaction == 'I') {
        paramtitle = '장비 등록';
      } else {
        paramtitle = '장비 수정';
      }

      const modal = await openModal(mdItem, {
        ttitle: paramtitle, //모달 상단의 제목 : ex) 장비관리
        troomid: this.rmseq, //강의실코드 (담아와서 변수명을 변경한게 아닌 초기에 저장한 값 this.rmseq을 그대로 들고옴)
        troomname: this.irmname, //강의실명
        titemcode: this.itemcode, //장비코드
        taction: this.iaction,
      });

      modal.onclose = (popupparam) => {
        console.log('Close : ' + popupparam);
        this.fn_itemList();
        //return false; //Modal will not be closed
      };
    },

    page: function (total, page) {
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>
