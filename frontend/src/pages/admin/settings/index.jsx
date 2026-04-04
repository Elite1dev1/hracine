import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import {
  useAdminGetSettingsQuery,
  useAdminUpdateSettingsMutation,
} from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PAYSTACK_KEY_REGEX = /^sk_(test|live)_[A-Za-z0-9]+$/;

const AdminSettingsPage = () => {
  const { data, isLoading, error } = useAdminGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useAdminUpdateSettingsMutation();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("200");
  const [preOrderFreeShippingThreshold, setPreOrderFreeShippingThreshold] = useState("25000");
  const [freeShippingBannerText, setFreeShippingBannerText] = useState("Free shipping on orders above 25,000");
  const [todayDeliveryPrice, setTodayDeliveryPrice] = useState("60");
  const [sevenDayDeliveryPrice, setSevenDayDeliveryPrice] = useState("20");
  const [paystackTestApiKey, setPaystackTestApiKey] = useState("");
  const [paystackLiveApiKey, setPaystackLiveApiKey] = useState("");
  const [paystackMode, setPaystackMode] = useState("test");
  const [showTestApiKey, setShowTestApiKey] = useState(false);
  const [showLiveApiKey, setShowLiveApiKey] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const adminInfo = Cookies.get('adminInfo');
      if (!adminInfo) {
        setIsSuperAdmin(false);
        return;
      }

      const parsedInfo = JSON.parse(adminInfo);
      const role = parsedInfo?.admin?.role || '';
      setIsSuperAdmin(role.toLowerCase() === 'super admin');
    } catch (cookieError) {
      setIsSuperAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (data?.data) {
      setFreeShippingThreshold(
        String(data.data.freeShippingThreshold ?? 200)
      );
      setPreOrderFreeShippingThreshold(
        String(data.data.preOrderFreeShippingThreshold ?? 25000)
      );
      setFreeShippingBannerText(data.data.freeShippingBannerText ?? "Free shipping on orders above 25,000");
      setTodayDeliveryPrice(String(data.data.todayDeliveryPrice ?? 60));
      setSevenDayDeliveryPrice(
        String(data.data.sevenDayDeliveryPrice ?? 20)
      );
      setPaystackMode(data.data.paystackMode === "live" ? "live" : "test");
      if (typeof data.data.paystackTestApiKey === "string") {
        setPaystackTestApiKey(data.data.paystackTestApiKey);
      }
      if (typeof data.data.paystackLiveApiKey === "string") {
        setPaystackLiveApiKey(data.data.paystackLiveApiKey);
      }
    }
  }, [data]);

  const handleNumericInput = (value, setter) => {
    const sanitized = value.replace(/[^\d.]/g, "");
    const normalized =
      sanitized.split(".").length > 2
        ? `${sanitized.split(".")[0]}.${sanitized.split(".").slice(1).join("")}`
        : sanitized;
    setter(normalized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const threshold = Number(freeShippingThreshold);
    const preOrderThreshold = Number(preOrderFreeShippingThreshold);
    const todayPrice = Number(todayDeliveryPrice);
    const sevenDayPrice = Number(sevenDayDeliveryPrice);

    if (
      !Number.isFinite(threshold) ||
      threshold < 0 ||
      !Number.isFinite(preOrderThreshold) ||
      preOrderThreshold < 0 ||
      !Number.isFinite(todayPrice) ||
      todayPrice < 0 ||
      !Number.isFinite(sevenDayPrice) ||
      sevenDayPrice < 0
    ) {
      toast.error("Please enter valid numeric values greater than or equal to 0");
      return;
    }

    const payload = {
      freeShippingThreshold: threshold,
      preOrderFreeShippingThreshold: preOrderThreshold,
      freeShippingBannerText,
      todayDeliveryPrice: todayPrice,
      sevenDayDeliveryPrice: sevenDayPrice,
    };

    if (isSuperAdmin) {
      const trimmedTestApiKey = paystackTestApiKey.trim();
      const trimmedLiveApiKey = paystackLiveApiKey.trim();

      if (!trimmedTestApiKey || !trimmedLiveApiKey) {
        toast.error("Both Test API Key and Live API Key are required");
        return;
      }

      if (!PAYSTACK_KEY_REGEX.test(trimmedTestApiKey) || !trimmedTestApiKey.startsWith("sk_test_")) {
        toast.error("Invalid Test API Key format. Expected sk_test_xxx");
        return;
      }

      if (!PAYSTACK_KEY_REGEX.test(trimmedLiveApiKey) || !trimmedLiveApiKey.startsWith("sk_live_")) {
        toast.error("Invalid Live API Key format. Expected sk_live_xxx");
        return;
      }

      if (!["test", "live"].includes(paystackMode)) {
        toast.error("Please select a valid Paystack mode");
        return;
      }

      payload.paystackTestApiKey = trimmedTestApiKey;
      payload.paystackLiveApiKey = trimmedLiveApiKey;
      payload.paystackMode = paystackMode;
    }

    try {
      await updateSettings(payload).unwrap();
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <ClipLoader size={50} color="#3498db" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>
          Error loading settings
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1
          style={{
            marginBottom: '22px',
            color: '#2c3e50',
            fontSize: 'clamp(1.5rem, 2vw, 1.95rem)',
            lineHeight: 1.25,
          }}
        >
          Settings
        </h1>

        <div style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: '18px',
                  color: '#2c3e50',
                  fontSize: 'clamp(1.1rem, 1.55vw, 1.35rem)',
                  lineHeight: 1.3,
                }}
              >
                Shipping Settings
              </h2>

              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="freeShippingThreshold"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                    fontSize: '0.95rem',
                  }}
                >
                  Free Shipping Threshold (₦)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="freeShippingThreshold"
                  value={freeShippingThreshold}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setFreeShippingThreshold)
                  }
                  placeholder="e.g. 200"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
                <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                  Customers need to spend this amount or more to qualify for free shipping.
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="preOrderFreeShippingThreshold"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                    fontSize: '0.95rem',
                  }}
                >
                  Pre-order Free Shipping Threshold (₦)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="preOrderFreeShippingThreshold"
                  value={preOrderFreeShippingThreshold}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setPreOrderFreeShippingThreshold)
                  }
                  placeholder="e.g. 25000"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
                <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                  Threshold for free shipping on pre-order only carts.
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="freeShippingBannerText"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                    fontSize: '0.95rem',
                  }}
                >
                  Free Shipping Banner Text
                </label>
                <input
                  type="text"
                  id="freeShippingBannerText"
                  value={freeShippingBannerText}
                  onChange={(e) => setFreeShippingBannerText(e.target.value)}
                  placeholder="e.g. Free shipping on orders above 25,000"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
                <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                  Text displayed in the free shipping banner on the storefront.
                </p>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="todayDeliveryPrice"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                    fontSize: '0.95rem',
                  }}
                >
                  Delivery Price (Today Delivery) (₦)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="todayDeliveryPrice"
                  value={todayDeliveryPrice}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setTodayDeliveryPrice)
                  }
                  placeholder="e.g. 60"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label
                  htmlFor="sevenDayDeliveryPrice"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#34495e',
                    fontSize: '0.95rem',
                  }}
                >
                  Delivery Price (7-Day Delivery) (₦)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="sevenDayDeliveryPrice"
                  value={sevenDayDeliveryPrice}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, setSevenDayDeliveryPrice)
                  }
                  placeholder="e.g. 20"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                />
              </div>

            </div>

            <div
              style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: '18px',
                  color: '#2c3e50',
                  fontSize: 'clamp(1.1rem, 1.55vw, 1.35rem)',
                  lineHeight: 1.3,
                }}
              >
                Paystack Configuration
              </h2>

              {!isSuperAdmin ? (
                <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
                  Only Super Admin can view and edit Paystack API keys.
                </p>
              ) : (
                <>
                  <div style={{ marginBottom: '18px' }}>
                    <label
                      htmlFor="paystackMode"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#34495e',
                        fontSize: '0.95rem',
                      }}
                    >
                      Mode
                    </label>
                    <select
                      id="paystackMode"
                      value={paystackMode}
                      onChange={(e) => setPaystackMode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '16px',
                        backgroundColor: '#fff',
                      }}
                    >
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label
                      htmlFor="paystackTestApiKey"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#34495e',
                        fontSize: '0.95rem',
                      }}
                    >
                      Test API Key
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showTestApiKey ? "text" : "password"}
                        id="paystackTestApiKey"
                        value={paystackTestApiKey}
                        onChange={(e) => setPaystackTestApiKey(e.target.value)}
                        placeholder="sk_test_..."
                        required={isSuperAdmin}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '16px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTestApiKey((prev) => !prev)}
                        style={{
                          padding: '10px 14px',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          minWidth: '95px',
                        }}
                      >
                        {showTestApiKey ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                      Used for sandbox transactions
                    </p>
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label
                      htmlFor="paystackLiveApiKey"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        color: '#34495e',
                        fontSize: '0.95rem',
                      }}
                    >
                      Live API Key
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type={showLiveApiKey ? "text" : "password"}
                        id="paystackLiveApiKey"
                        value={paystackLiveApiKey}
                        onChange={(e) => setPaystackLiveApiKey(e.target.value)}
                        placeholder="sk_live_..."
                        required={isSuperAdmin}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          fontSize: '16px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLiveApiKey((prev) => !prev)}
                        style={{
                          padding: '10px 14px',
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          minWidth: '95px',
                        }}
                      >
                        {showLiveApiKey ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '14px' }}>
                      Used for real customer payments
                    </p>
                  </div>
                </>
              )}
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '12px 30px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                opacity: isUpdating ? 0.6 : 1,
              }}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
