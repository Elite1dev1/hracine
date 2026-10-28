import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layout/admin/AdminLayout';
import { useAdminGetSettingsQuery, useAdminUpdateSettingsMutation } from '@/redux/features/admin/adminApi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PAYSTACK_KEY_REGEX = /^sk_(test|live)_[A-Za-z0-9]+$/;

const sanitizeNumericInput = (value) => {
  const sanitized = value.replace(/[^\d.]/g, '');
  const [whole, ...fraction] = sanitized.split('.');
  return fraction.length ? `${whole}.${fraction.join('')}` : whole;
};

const SettingsIcon = ({ name }) => {
  const paths = {
    root: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    shipping: <><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></>,
    payment: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></>,
    eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6"/></>,
  };
  return <svg className="settings-section-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const SettingsCard = ({ icon, title, description, children, className = '' }) => (
  <section className={`admin-card admin-settings-card ${className}`}>
    <div className="admin-settings-card-heading"><span className="admin-settings-section-icon"><SettingsIcon name={icon} /></span><div><h2>{title}</h2><p>{description}</p></div></div>
    {children}
  </section>
);

const NumericField = ({ id, label, value, setValue, help, required = true }) => (
  <div className="admin-settings-field">
    <label htmlFor={id}>{label}</label>
    <div className="admin-settings-input-wrap"><input id={id} type="text" inputMode="decimal" value={value} onChange={(event) => setValue(sanitizeNumericInput(event.target.value))} required={required} /></div>
    {help && <p className="admin-settings-help">{help}</p>}
  </div>
);

const KeyField = ({ id, label, value, setValue, visible, setVisible, configured, help }) => (
  <div className="admin-settings-field">
    <label htmlFor={id}>{label}</label>
    <div className="admin-key-input-row"><input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => setValue(event.target.value)} placeholder={configured ? 'Configured · leave blank to keep current key' : 'Enter secret key'} autoComplete="new-password" spellCheck="false" aria-describedby={`${id}-help`} />
      <button type="button" className="admin-key-toggle" onClick={() => setVisible((current) => !current)} aria-label={`${visible ? 'Hide' : 'Show'} ${label}`} aria-pressed={visible}><SettingsIcon name={visible ? 'eyeOff' : 'eye'} /><span>{visible ? 'Hide' : 'Show'}</span></button>
    </div>
    <p className="admin-settings-help" id={`${id}-help`}>{configured ? 'A key is saved securely. Enter a new key only when you want to replace it.' : help}</p>
    <span className={`admin-key-status ${configured ? 'configured' : 'missing'}`}>{configured ? 'Key configured' : 'Key not configured'}</span>
  </div>
);

const AdminSettingsPage = () => {
  const { data, isLoading, error } = useAdminGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useAdminUpdateSettingsMutation();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('200');
  const [preOrderFreeShippingThreshold, setPreOrderFreeShippingThreshold] = useState('25000');
  const [freeShippingBannerText, setFreeShippingBannerText] = useState('Free shipping on orders above 25,000');
  const [todayDeliveryPrice, setTodayDeliveryPrice] = useState('60');
  const [sevenDayDeliveryPrice, setSevenDayDeliveryPrice] = useState('20');
  const [rootCheckFee, setRootCheckFee] = useState('5000');
  const [paystackTestApiKey, setPaystackTestApiKey] = useState('');
  const [paystackLiveApiKey, setPaystackLiveApiKey] = useState('');
  const [paystackMode, setPaystackMode] = useState('test');
  const [showTestApiKey, setShowTestApiKey] = useState(false);
  const [showLiveApiKey, setShowLiveApiKey] = useState(false);
  const [testKeyConfigured, setTestKeyConfigured] = useState(false);
  const [liveKeyConfigured, setLiveKeyConfigured] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const adminInfo = Cookies.get('adminInfo');
      const role = adminInfo ? JSON.parse(adminInfo)?.admin?.role || '' : '';
      setIsSuperAdmin(role.toLowerCase() === 'super admin');
    } catch (cookieError) {
      setIsSuperAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (!data?.data) return;
    setFreeShippingThreshold(String(data.data.freeShippingThreshold ?? 200));
    setPreOrderFreeShippingThreshold(String(data.data.preOrderFreeShippingThreshold ?? 25000));
    setFreeShippingBannerText(data.data.freeShippingBannerText ?? 'Free shipping on orders above 25,000');
    setTodayDeliveryPrice(String(data.data.todayDeliveryPrice ?? 60));
    setSevenDayDeliveryPrice(String(data.data.sevenDayDeliveryPrice ?? 20));
    setRootCheckFee(String(data.data.rootCheckFee ?? 5000));
    setPaystackMode(data.data.paystackMode === 'live' ? 'live' : 'test');
    setTestKeyConfigured(Boolean(data.data.paystackTestApiKeyConfigured));
    setLiveKeyConfigured(Boolean(data.data.paystackLiveApiKeyConfigured));
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const threshold = Number(freeShippingThreshold);
    const preOrderThreshold = Number(preOrderFreeShippingThreshold);
    const todayPrice = Number(todayDeliveryPrice);
    const sevenDayPrice = Number(sevenDayDeliveryPrice);
    const parsedRootCheckFee = Number(rootCheckFee);
    if (![threshold, preOrderThreshold, todayPrice, sevenDayPrice, parsedRootCheckFee].every(Number.isFinite) || threshold < 0 || preOrderThreshold < 0 || todayPrice < 0 || sevenDayPrice < 0 || parsedRootCheckFee <= 0) {
      toast.error('Enter valid amounts; the Root Check fee must be greater than 0');
      return;
    }
    if (!freeShippingBannerText.trim()) {
      toast.error('Enter text for the free shipping banner');
      return;
    }

    const payload = {
      freeShippingThreshold: threshold,
      preOrderFreeShippingThreshold: preOrderThreshold,
      freeShippingBannerText: freeShippingBannerText.trim(),
      todayDeliveryPrice: todayPrice,
      sevenDayDeliveryPrice: sevenDayPrice,
      rootCheckFee: parsedRootCheckFee,
    };

    if (isSuperAdmin) {
      if (!['test', 'live'].includes(paystackMode)) {
        toast.error('Please select a valid Paystack mode');
        return;
      }
      payload.paystackMode = paystackMode;
      const trimmedTestApiKey = paystackTestApiKey.trim();
      const trimmedLiveApiKey = paystackLiveApiKey.trim();
      if (trimmedTestApiKey && (!PAYSTACK_KEY_REGEX.test(trimmedTestApiKey) || !trimmedTestApiKey.startsWith('sk_test_'))) {
        toast.error('Invalid Test API Key format. Expected sk_test_xxx');
        return;
      }
      if (trimmedLiveApiKey && (!PAYSTACK_KEY_REGEX.test(trimmedLiveApiKey) || !trimmedLiveApiKey.startsWith('sk_live_'))) {
        toast.error('Invalid Live API Key format. Expected sk_live_xxx');
        return;
      }
      if (trimmedTestApiKey) payload.paystackTestApiKey = trimmedTestApiKey;
      if (trimmedLiveApiKey) payload.paystackLiveApiKey = trimmedLiveApiKey;
    }

    try {
      const result = await updateSettings(payload).unwrap();
      setPaystackTestApiKey('');
      setPaystackLiveApiKey('');
      if (result?.data) {
        setTestKeyConfigured(Boolean(result.data.paystackTestApiKeyConfigured));
        setLiveKeyConfigured(Boolean(result.data.paystackLiveApiKeyConfigured));
      }
      toast.success('Settings saved successfully');
    } catch (saveError) {
      toast.error(saveError?.data?.message || 'Failed to update settings');
    }
  };

  if (isLoading) return <AdminLayout><div className="admin-state"><ClipLoader size={38} color="#85312C" /><span>Loading settings…</span></div></AdminLayout>;
  if (error) return <AdminLayout><div className="admin-alert">Settings could not be loaded. Please refresh to try again.</div></AdminLayout>;

  return <AdminLayout>
    <main className="admin-settings-page">
      <header className="admin-page-heading"><div><span className="admin-eyebrow">STORE CONFIGURATION</span><h1>Settings</h1><p>Manage your store settings and configurations.</p></div></header>
      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <SettingsCard icon="root" title="Root Check Settings" description="Set the amount charged for root check bookings.">
          <div className="admin-settings-fields root-check-fields"><NumericField id="rootCheckFee" label="Root Check Fee (₦)" value={rootCheckFee} setValue={setRootCheckFee} help="This amount appears on the Root Check page, booking buttons, credit notice, and FAQ." /></div>
        </SettingsCard>

        <SettingsCard icon="shipping" title="Shipping Settings" description="Configure shipping thresholds and delivery pricing.">
          <div className="admin-settings-fields shipping-fields">
            <NumericField id="freeShippingThreshold" label="Free Shipping Threshold (₦)" value={freeShippingThreshold} setValue={setFreeShippingThreshold} help="Customers need to spend this amount or more to qualify for free shipping." />
            <NumericField id="preOrderFreeShippingThreshold" label="Pre-order Free Shipping Threshold (₦)" value={preOrderFreeShippingThreshold} setValue={setPreOrderFreeShippingThreshold} help="Threshold for free shipping on pre-order only carts." />
            <div className="admin-settings-field"><label htmlFor="freeShippingBannerText">Free Shipping Banner Text</label><input id="freeShippingBannerText" type="text" value={freeShippingBannerText} onChange={(event) => setFreeShippingBannerText(event.target.value)} required /><p className="admin-settings-help">Text displayed in the free shipping banner on the storefront.</p></div>
            <NumericField id="sevenDayDeliveryPrice" label="Delivery Price (7-Day Delivery) (₦)" value={sevenDayDeliveryPrice} setValue={setSevenDayDeliveryPrice} help="Standard delivery price for 7-day delivery orders." />
            <NumericField id="todayDeliveryPrice" label="Delivery Price (Today Delivery) (₦)" value={todayDeliveryPrice} setValue={setTodayDeliveryPrice} help="Delivery price for same-day delivery orders." />
          </div>
        </SettingsCard>

        <SettingsCard icon="payment" title="Paystack Configuration" description="Manage your Paystack payment configuration." className="admin-paystack-card">
          {!isSuperAdmin ? <p className="admin-settings-restricted">Only Super Admin can view and edit Paystack configuration.</p> : <div className="admin-settings-fields paystack-fields">
            <div className="admin-settings-field"><label htmlFor="paystackMode">Mode</label><select id="paystackMode" value={paystackMode} onChange={(event) => setPaystackMode(event.target.value)}><option value="test">Test mode</option><option value="live">Live mode</option></select><p className="admin-settings-help">Select the payment mode already configured for your store.</p><span className={`admin-mode-badge ${paystackMode}`}>{paystackMode === 'live' ? 'Live payments' : 'Sandbox testing'}</span></div>
            <KeyField id="paystackTestApiKey" label="Test API Key" value={paystackTestApiKey} setValue={setPaystackTestApiKey} visible={showTestApiKey} setVisible={setShowTestApiKey} configured={testKeyConfigured} help="Used for sandbox transactions. New keys are sent only when entered." />
            <KeyField id="paystackLiveApiKey" label="Live API Key" value={paystackLiveApiKey} setValue={setPaystackLiveApiKey} visible={showLiveApiKey} setVisible={setShowLiveApiKey} configured={liveKeyConfigured} help="Used for real customer payments. New keys are sent only when entered." />
          </div>}
        </SettingsCard>

        <div className="admin-settings-savebar"><div><strong>Save your changes</strong><span>Settings apply across your storefront after they are saved.</span></div><button className="admin-settings-save-button" type="submit" disabled={isUpdating}><SettingsIcon name="save" /><span>{isUpdating ? 'Saving settings…' : 'Save Changes'}</span></button></div>
      </form>
    </main>
  </AdminLayout>;
};

export default AdminSettingsPage;
