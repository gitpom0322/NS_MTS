const { ref, onMounted } = Vue;

export default {
  setup() {
    const refList = ref([]);
    const tsPate = ref(1); //目前第幾頁
    const trRowsId = ref(0); //目前選取的列
    const refRowData = ref([{}]); //目前選取的列資料

    let isResizing = false;
    let posContent = null;
    let resizer = null;
    let map = null; // 定義 map 變量

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX - posContent.getBoundingClientRect().left;
      posContent.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const geocodeAddress = (address, callback) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          callback(location);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    const createCustomOverlay = (position, content, map) => {
      class CustomOverlay extends google.maps.OverlayView {
        constructor(position, content) {
          super();
          this.position = position;
          this.content = content;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.innerHTML = this.content;
          this.div = div;
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(this.div);
        }

        draw() {
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(this.position);
          const div = this.div;
          div.style.left = (position.x - 70) + 'px';
          div.style.top = (position.y - 130) + 'px'; // 調整位置，使其在圖標上方
        }

        onRemove() {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      const overlay = new CustomOverlay(position, content);
      overlay.setMap(map);
    };

    const createTopLeftOverlay = (content, map, callback) => {
      class TopLeftOverlay extends google.maps.OverlayView {
        constructor(content) {
          super();
          this.content = content;
        }

        onAdd() {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.opacity = '0.75'; // 設置透明度
          div.style.background = 'white';
          div.style.padding = '5px';
          div.style.border = '1px solid black';
          div.innerHTML = this.content;
          this.div = div;
          const panes = this.getPanes();
          panes.overlayLayer.appendChild(this.div);
          if (callback) callback(div);
        }

        draw() {
          const div = this.div;
          //div.id = 'divCountdown';
          div.style.position = 'absolute';
          div.style.left = '-320px'; // 設置在左方
          div.style.top = '-380px'; //  設置在上方

          div.style.width = '45px';
          div.style.height = '45px';
          div.style.padding = '5px';
          div.style.background = '#86d0f5';
          div.style.opacity = '0.75';

          div.style.border = '3px solid black';
          div.style.textAlign = 'center';
          div.style.display = 'flex'; // 使用 flexbox
          div.style.alignItems = 'center'; // 垂直置中
          div.style.justifyContent = 'center'; // 水平置中

          div.style.color = '#000';
          
        }

        onRemove() {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      const overlay = new TopLeftOverlay(content);
      overlay.setMap(map);
    };

    const initMap = () => {
      const addresses = [
        "台南市北區大武街297號",
        "台南市北區實踐街112號",
        "台南市北區大武街98號",
        "台南市北區大武街500號",
      ];

      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 23.0109, lng: 120.2215 }, // 台南北區的中心點
        zoomControl: true, // 啟用縮放控件
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER // 設置控件位置
        },
        mapTypeControl: true, // 啟用地圖類型控件
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DEFAULT,
          position: google.maps.ControlPosition.RIGHT_BOTTOM // 設置控件位置為右下角
        }
      });

      const overlayStyle = "width:120px;height:70px; background: white; padding: 5px; border: 1px solid black; opacity: 0.75;";
      const topLeftStyle = `
        position:absolute;
        width: 30px;
        height: 30px;
        background: #42b6f0;
        padding: 5px;
        border: 5px solid black;
        opacity: 0.75;
      `;
      addresses.forEach(address => {
        geocodeAddress(address, (location) => {
          const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: address,
            icon: 'https://app.non-sheng.com.tw/res/images/fav.ico' // 指定圖標的 URL
          });

          const content = `<div style="${overlayStyle}">
                             <strong>${address}</strong><br>這是自訂訊息圖層的內容。
                           </div>`;

          createCustomOverlay(location, content, map);
        });
      });

      // 添加左上方的半透明圖層
      const topLeftContent = `<div id="divCountdown">自訂訊息</div>`;

      createTopLeftOverlay(topLeftContent, map, (div) => {
        // 設置倒數計時器
        const countdownElement = div;
        console.log('countdownElement: ', countdownElement);
        let countdown = 10; // 倒數計時秒數
        const countdownInterval = setInterval(() => {
          if (countdownElement) {
            countdownElement.innerHTML = `<strong>${countdown} 秒</strong>`;
            console.log('倒數計時: '+ countdown +' 秒');
            countdown--;
            if (countdown < 0) {
              countdown = 10;
              clearInterval(countdownInterval);
              //countdownElement.innerHTML = `<strong>左上方的訊息</strong><br>倒數計時結束`;
            }
          }
        }, 1000);
      });
    };

    onMounted(() => {
      // 初始化
      posContent = document.querySelector('.pos-content');
      resizer = document.querySelector('.pos-content-resizer');

      if (resizer) {
        resizer.addEventListener('mousedown', (e) => {
          isResizing = true;
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        });
      }

      // 初始化地圖
      initMap();
    });

    return {
      refList,
      tsPate,
      trRowsId,
      refRowData,
      initMap,
    };
  },
  template: await fetch('./www/views/car_chicken/list.html').then(response => response.text())
};