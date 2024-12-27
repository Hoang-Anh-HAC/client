import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import {
  Breadcrumb,
  Button,
  Image,
  message,
  Spin,
  Modal,
  Form,
  Input,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import Product from "../../components/user/Product";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  const [mainImage, setMainImage] = useState();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [verificationAnswer, setVerificationAnswer] = useState("");

  const [totalProducts, setTotalProducts] = useState(1);

  const generateQuestion = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return {
      question: `Nhập lại chuỗi sau`,
      display: result,
      answer: result,
    };
  };

  const [verification, setVerification] = useState(generateQuestion());

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [matchingProducts, setMatchingProducts] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await axios.get(`/product/${slug}`);
        const productData = productRes.data;

        setProduct(productData);
        setRelatedProducts(productData.relatedProducts);
        setMatchingProducts(productData.matchingProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Đang tải sản phẩm..." />
      </div>
    );
  if (!product) return <p>Sản phẩm không tồn tại.</p>;

  const svgPaths = [
    {
      text: "Cam kết chính hãng",
      svgPath:
        "M9 12.75L11.25 15L15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z",
    },
    {
      text: "Hỗ trợ giao hàng",
      svgPath:
        "M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z",
    },
    {
      text: "Giá thành hợp lý",
      svgPath:
        "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    },
    {
      text: "Hỗ trợ nhiệt tình",
      svgPath:
        "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
    },
  ];

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (values) => {
    try {
      if (verificationAnswer.toUpperCase() !== verification.answer) {
        message.error("Mã xác nhận không chính xác!");
        return;
      }

      setLoading(true);
      const response = await axios.post("prodform/", {
        ...values,
        productTitle: product.title,
      });

      if (response.status === 200) {
        message.success("Gửi yêu cầu thành công!");
        setIsContactModalOpen(false);
        form.resetFields();
        setVerificationAnswer("");
        setVerification(generateQuestion());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="w-full flex justify-center items-center px-4 lg:px-0">
      <div className="max-w-[1200px] flex flex-col gap-3 w-full">
        <Breadcrumb
          items={[
            { title: <a href="/">Trang Chủ</a> },
            {
              title:
                (
                  <a href={`/product-list/${product.categoryID?.slug}`}>
                    {product.categoryID?.title}
                  </a>
                ) || "Loading...",
            },
            {
              title:
                (
                  <a
                    href={`/product-list/${product.categoryID?.slug}/${product.brandID?.slug}`}
                  >
                    {product.brandID?.title}
                  </a>
                ) || "Loading...",
            },
            { title: product.title || "Loading..." },
          ]}
          className="w-full py-3"
        />
        <div className="bg-white p-4 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10">
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            {product.images.length ? (
              <Image
                src={mainImage || product.images[0]?.url || ""}
                alt={product.title}
                className="w-full mb-4 object-contain"
              />
            ) : (
              <div className=" p-4 w-full h-full object-contain transition-transform duration-300 ease-in-out transform group-hover:scale-110 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`${product.title} ${index}`}
                    className={`w-20 h-20 border cursor-pointer  ${
                      mainImage === image.url
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(image.url)}
                  />
                  {index === 3 && product.images.length > 4 && (
                    <div
                      className=" absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center cursor-pointer text-white"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <span className="text-xs mt-1">Xem tất cả</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-1/2">
            <div className="space-y-3">
              <h1 className="text-xl lg:text-2xl font-semibold">
                {product.title}
              </h1>
              <p className="text-sm lg:text-base">
                Mã sản phẩm:
                <span className="text-primary ml-1">{product.productID}</span>
              </p>
              <p className="text-sm lg:text-base">
                Thương hiệu:
                <span className="text-primary ml-1">
                  {product.brandID?.title || "N/A"}
                </span>
              </p>
            </div>

            <div className="mt-auto pt-6">
              <p className="text-2xl lg:text-3xl text-primary font-medium mb-4">
                {formatPrice(product.prices)}
              </p>
              <Button
                type="primary"
                className="bg-primary uppercase py-4 lg:py-6 w-full text-base lg:text-lg font-light"
                onClick={() => setIsContactModalOpen(true)}
              >
                Liên Hệ Giá Tốt
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-[350px] flex flex-col justify-between gap-6">
            <div className="grid gap-3">
              {svgPaths.map((path, index) => (
                <span key={index} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={path.svgPath}
                    />
                  </svg>
                  <p className="text-sm lg:text-base">{path.text}</p>
                </span>
              ))}
            </div>

            <div className="grid bg-primary/5 p-4 rounded border border-dashed border-primary">
              <p className="font-semibold mb-2">Hỗ Trợ Mua Hàng:</p>
              <span className="text-sm lg:text-base">028 399 70399</span>
              <span className="text-sm lg:text-base">090 830 1313</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex flex-col lg:flex-row gap-3">
            <div
              className={`bg-white p-4 ${
                product.specifications.length > 0 || matchingProducts.length > 0
                  ? "w-full lg:w-2/3"
                  : "w-full"
              }`}
            >
              <h2 className="font-medium text-xl lg:text-2xl mb-2">
                Mô tả sản phẩm
              </h2>
              <div
                className="text-sm lg:text-base font-light prose max-w-none whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              <div className="flex justify-center">
                {product.images?.[0]?.url && (
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.title}
                    className="max-w-full lg:max-w-[600px] h-auto object-contain"
                  />
                )}
              </div>
            </div>

            <div
              className={`flex flex-col gap-3  ${
                product.specifications.length > 0 || matchingProducts.length > 0
                  ? "w-full lg:w-1/3"
                  : " "
              }`}
            >
              {product.specifications.length > 0 && (
                <div className="bg-white p-4">
                  <h2 className="font-medium text-xl lg:text-2xl mb-2">
                    Thông số kỹ thuật
                  </h2>
                  <div className="overflow-y-hidden max-h-[350px] relative min-w-full">
                    <table className="min-w-full border-collapse border border-gray-200">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <React.Fragment key={index}>
                            {spec.topic && (
                              <tr className="bg-primary/5">
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 border border-gray-200 font-semibold text-xl"
                                >
                                  {spec.topic}
                                </td>
                              </tr>
                            )}
                            {spec.details.map((detail, detailIndex) => (
                              <tr
                                key={detailIndex}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-2 border border-gray-200 w-1/3 bg-gray-50 font-medium">
                                  {detail.title}
                                </td>
                                <td
                                  className="px-4 py-2 border border-gray-200 whitespace-pre-wrap"
                                  dangerouslySetInnerHTML={{
                                    __html: detail.description,
                                  }}
                                />
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>
                  <Button
                    className="left-1/2 transform -translate-x-1/2 z-10 w-full"
                    onClick={showModal}
                  >
                    Hiển thị thêm
                  </Button>
                </div>
              )}

              {matchingProducts.length > 0 && (
                <div className="bg-white p-4 ">
                  <h2 className="font-medium text-xl lg:text-2xl mb-4">
                    Sản phẩm phù hợp
                  </h2>
                  <div className="max-h-[500px] overflow-y-auto px-2">
                    <div className="flex flex-col gap-2 ">
                      <Product
                        relatedProducts={matchingProducts}
                        setTotalProducts={setTotalProducts}
                        layoutType="horizontal"
                      />
                    </div>
                  </div>
                </div>
              )}

              {relatedProducts.length > 0 && (
                <div className="bg-white p-4 ">
                  <h2 className="font-medium text-xl lg:text-2xl mb-4">
                    Sản phẩm liên quan
                  </h2>
                  <div className="max-h-[500px] overflow-y-auto px-2">
                    <div className="flex flex-col gap-2 ">
                      <Product
                        relatedProducts={relatedProducts}
                        setTotalProducts={setTotalProducts}
                        layoutType="horizontal"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommend */}
        {product.seriesID?._id && (
          <div className="bg-white p-4 lg:p-6">
            <h2 className="font-medium text-xl lg:text-2xl mb-4">
              Sản phẩm cùng dòng
            </h2>
            <div className="relative flex flex-col overflow-x-auto">
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hover:bg-gray-200 hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  // Logic để cuộn sang trái
                  document
                    .getElementById("product-series")
                    .scrollBy({ left: -400, behavior: "smooth" });
                }}
              >
                <LeftOutlined className="text-lg" />
              </button>
              <div
                id="product-series"
                className="grid grid-flow-col auto-cols-max gap-4 overflow-x-hidden"
              >
                <Product
                  series={product.seriesID._id}
                  setTotalProducts={setTotalProducts}
                  recentProduct={product._id}
                />
              </div>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hover:bg-gray-200 hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  // Logic để cuộn sang phải
                  document
                    .getElementById("product-series")
                    .scrollBy({ left: 400, behavior: "smooth" });
                }}
              >
                <RightOutlined className="text-lg" />
              </button>
            </div>
          </div>
        )}
        {/* Pop up */}
        <Modal
          title="Thông số kỹ thuật đầy đủ"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <React.Fragment key={index}>
                    {spec.topic && (
                      <tr className="bg-primary/5">
                        <td
                          colSpan="2"
                          className="px-4 py-2 border border-gray-200 font-semibold text-xl"
                        >
                          {spec.topic}
                        </td>
                      </tr>
                    )}
                    {spec.details.map((detail, detailIndex) => (
                      <tr key={detailIndex} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200 w-1/3 bg-gray-50 font-medium">
                          {detail.title}
                        </td>
                        <td
                          className="px-4 py-2 border border-gray-200 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: detail.description,
                          }}
                        />
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
        <Modal
          title="Thư viện hình ảnh sản phẩm"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={1000}
          centered
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square relative group">
                <Image
                  src={image.url}
                  alt={`${product.title} - Hình ${index + 1}`}
                  className="border border-gray-200 shadow-sm rounded-lg"
                  preview={{
                    mask: <div className="text-sm">Xem chi tiết</div>,
                  }}
                />
              </div>
            ))}
          </div>
        </Modal>
        <Modal
          title={`Yêu cầu giá tốt sản phẩm ${product.productID}`}
          open={isContactModalOpen}
          onCancel={() => setIsContactModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <p className="mb-4 text-sm lg:text-base">
            Quý khách vui lòng để lại thông tin. Bộ phận kinh doanh của chúng
            tôi sẽ liên hệ tới quý khách trong thời gian sớm nhất.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ prodID: product.productID }}
          >
            <Form.Item label="Mã Sản Phẩm" name="prodID">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Họ Và Tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số Điện Thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>

            <Form.Item label="Lời Nhắn" name="message">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label={verification.question}>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span
                    className="bg-gray-100 p-2 text-center text-xl font-mono tracking-wider select-none w-full"
                    style={{ userSelect: "none" }}
                  >
                    {verification.display}
                  </span>
                  <Button
                    type="text"
                    className="ml-2"
                    onClick={() => setVerification(generateQuestion())}
                  >
                    Tạo lại mã
                  </Button>
                </div>
                <Input
                  placeholder="Nhập mã xác nhận"
                  value={verificationAnswer}
                  onChange={(e) => setVerificationAnswer(e.target.value)}
                />
              </div>
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-primary w-full h-10"
                disabled={loading || !verificationAnswer}
              >
                GỬI YÊU CẦU
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default ProductDetail;
