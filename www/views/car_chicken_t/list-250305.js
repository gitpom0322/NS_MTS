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

    const initMap = () => {
      const addresses = [
        "台南市北區大武街297號",
        "台南市北區實踐街112號",
        "台南市北區大武街98號",
        "台南市北區大武街500號",
      ];

      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 23.0109, lng: 120.2215 }, // 台南北區的中心點
        zoomControl: true, // 啟用縮放控件
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER // 設置控件位置
        }
      });

      addresses.forEach(address => {
        geocodeAddress(address, (location) => {
          const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: address,
            icon: 'https://app.non-sheng.com.tw/res/images/fav.ico' // 指定圖標的 URL
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${address}</strong><br>這是自訂訊息圖層的內容。</div>`
          });

          // 打開 InfoWindow
          infoWindow.open(map, marker);

          // 添加點擊事件監聽器
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
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