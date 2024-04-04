// cozum yaparken izlenilen adimlar
//1-Bileşenleri Oluşturma: ParentComponent  "Pagination" adında bileşeni bir üst bileşen oluşturalim.ChildComponent   "Pages" adında bileşeni bir alt bileşen oluşturalim.
//2-API'den Verileri Alma:Pagination içinde, useEffect hook'unu kullanarak bir fetchData fonksiyonu çağıralim.
//fetchData fonksiyonu içinde, axios kütüphanesi aracılığıyla https://randomuser.me/api?results=25 adresine bir GET isteği gönderelim.
//3-Verileri Temizleme: API'den gelen veri yapısını incele.Bir cleanUserData fonksiyonu oluşturalim.
//cleanUserData fonksiyonu içinde, her kullanıcı için name, age ve email özelliklerini içeren yeni bir nesne oluşturun ve bu nesneleri bir dizi halinde döndürelim.
//4-Parent ve Child Bileşenleri Bağlama:
//Pagination içinde, temizlenmiş kullanıcı verilerini ve itemsPerPage değerini state'te tutsun.
//ParentComponent "Pagination" içinde, ChildComponent'i  "Pages" render edin ve temizlenmiş kullanıcı verilerini ve itemsPerPage değerini prop olarak iletelim.
//5-Sayfalama Mantığı:
//ChildComponent "Pagination"  içinde, geçerli sayfa numarasını ve toplam sayfa sayısını hesapla.
//ChildComponent  "Pagination" içinde, sayfa numaralarını düğmeler olarak render eden bir fonksiyon oluştur.
//ChildComponent  "Pagination" içinde, her sayfa numarası düğmesine tıklandığında, geçerli sayfayı değiştiren bir fonksiyon oluştur.
//ChildComponent  "Pagination" içinde, geçerli sayfanın öğelerini hesaplayarak render edelim.
//6-Yükleme Durumu ve Hata Yönetimi:
//ParentComponent "Pagination"  içinde, yükleme durumunu ve hata durumunu state'te tut.
//ParentComponent  "Pagination" içinde, yükleme durumuna göre bir yükleme animasyonu veya hata mesajı görüntüle.
//7-Bileşenleri Render Etme:
//ParentComponent  "Pagination" içinde, koşullu olarak yükleme durumunu, hata mesajını veya ChildComponent'i render et.
//ChildComponent  "Pages" içinde, kullanıcı verilerini, sayfa numaralarını ve sayfa içeriğini render et.
//son olarak format=pretty parametresi kullanılarak gelen aynı JSON yanıtı:
//{"name": "John", "age": 30, "city": "New York"} icin 
{/*
  "name": "John",
  "age": 30,
  "city": "New York"
*/}// format=pretty ile JSON verisi daha düzenli ve okunabilir bir biçimde gösterilmiştir. Bu, veriyi incelemeyi ve anlamayı kolaylaştırır.




// React ve axios kütüphanelerini import ediyoruz
import React, { useEffect, useState } from "react";
import axios from "axios";

// App bileşenini oluşturuyoruz ve Pagination bileşenini render ediyoruz
function App() {
  return <Pagination />;
}

// Yükleme animasyonu göstermek için bir bileşen oluşturuyoruz. bu kisim sart degil sadece gorsellik icin
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

//1- ParentComponent "Pagination" bileşenini oluşturalim: 
const Pagination = () => {
  
  const [userData, setUserData] = useState([]);// Kullanıcı verilerini tutmak için bir state değişkeni tanımlıyalim
  const [loading, setLoading] = useState(true);// Yükleme durumunu takip etmek için bir state değişkeni tanımlıyalim
  const [error, setError] = useState(null);// 6-Hata durumunu takip etmek için bir state değişkeni tanımlıyalim

  // Bileşen ilk render edildiğinde fetchData fonksiyonunu çağıralim
  useEffect(() => {
    fetchData();
  }, []);

  // 2-Kullanıcı verilerini API'den almak için bir asenkron fonksiyon oluşturalim
  const fetchData = async () => {
    try {
      // API'den veri alıyoruz.&format=pretty kullaniyoruz ki yapi daha okunabilir ollsun 
      const response = await axios.get("https://randomuser.me/api?results=25&format=pretty");
      // Alınan veriyi temizliyoruz
      const cleanedData = cleanUserData(response.data.results);
      // Temizlenmiş veriyi state değişkenine atıyoruz
      setUserData(cleanedData);
      // Yükleme durumunu false olarak ayarlıyoruz
      setLoading(false);
    } catch (error) {
      // Hata durumunda konsola hata mesajını yazdırıyoruz
      console.error("Error fetching data:", error);
      // Hata mesajını state değişkenine atıyoruz
      setError("Failed to fetch data. Please try again later.");
    }
  };

  // 3-Alınan kullanıcı verilerini temizlemek için bir fonksiyon oluşturalim
  const cleanUserData = (data) => {
    return data.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      age: user.dob.age,
      email: user.email,
    }));
  };

  // 7-Bileşenimizi render edelim
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Eğer yükleme durumu true ise LoadingSpinner bileşenini render edelim */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? ( // Eğer hata durumu varsa, hata mesajını göstersin
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : ( // Aksi takdirde,4- Pages bileşenini render ediyoruz ve userData ve itemsPerPage prop'larını iletiyoruz
        <Pages content={userData} itemsPerPage={5} />
      )}
    </div>
  );
};

// 1-Pages bileşenini oluşturuyoruz."Pages" bileşeni (Pages fonksiyonu) Child bileşenidir.
const Pages = ({ content, itemsPerPage }) => {
  // Geçerli sayfa numarasını takip etmek için bir state değişkeni tanımlıyalim
  const [currentPage, setCurrentPage] = useState(1);
  // Toplam sayfa sayısını hesaplasin
  const totalPages = Math.ceil(content.length / itemsPerPage);

  //5- Sayfa numarası değiştiğinde gerçekleştirilecek işlemi tanımlıyalim
  const handleClick = (pageNumber) => {
    // Geçerli sayfa numarasını güncelleme
    setCurrentPage(pageNumber);
  };

  // 5-Sayfa numaralarını render etmek için bir fonksiyon oluşturralim
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Toplam sayfa sayısı kadar döngü oluştursun
    for (let i = 1; i <= totalPages; i++) {
      // Her sayfa numarası için bir düğme oluşturalim
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {i}
        </button>
      );
    }
    // Oluşturulan düğmeleri döndürelim
    return pageNumbers;
  };

  // Geçerli sayfanın öğelerini hesaplıyalim
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = content.slice(indexOfFirstItem, indexOfLastItem);

  // 7-Bileşenimizi render ediyoruz
  return (
    <div className="border border-black" >
      {/* Tablo başlıklarını render ediyoruz */}
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Email
            </th>
          </tr>
        </thead>
        {/* Geçerli sayfanın öğelerini render ediyoruz */}
        <tbody className="border border-black">
          {currentItems.map((user, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.age}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Sayfa numarası düğmelerini render ediyoruz */}
      <div className="mt-0">{renderPageNumbers()}</div>
    </div>
  );
};

// App bileşenini export ediyoruz
export default App;

