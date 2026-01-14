import { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import {
	Stethoscope,
	Calendar,
	NotebookPen,
	HeartPulse,
	Loader2,
} from 'lucide-react';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE || '';

function Header({ current, onChange }) {
	const tabs = [
		{ key: 'doctors', label: 'Doctors', icon: Stethoscope },
		{ key: 'book', label: 'Book Appointment', icon: Calendar },
		{ key: 'symptoms', label: 'Symptoms', icon: NotebookPen },
		{ key: 'tips', label: 'Health Tips', icon: HeartPulse },
	];
	return (
		<div className="header">
			<div className="section">
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<Stethoscope className="w-7 h-7 text-brand-600" />
						<span className="text-2xl font-semibold text-slate-900">
							Doctor Consultation
						</span>
					</div>
				</div>
				<div className="flex gap-2 pb-3 overflow-x-auto">
					{tabs.map(({ key, label, icon: Icon }) => (
						<button
							key={key}
							onClick={() => onChange(key)}
							className={`tab ${
								current === key ? 'tab-active' : 'tab-inactive'
							}`}
						>
							<Icon className="w-5 h-5" />
							<span className="font-medium">{label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function Section({ title, subtitle, children, icon: Icon }) {
	return (
		<section className="section">
			<div className="mb-5 flex items-center gap-3">
				{Icon && <Icon className="w-6 h-6 text-brand-600" />}
				<div>
					<h2 className="section-title">{title}</h2>
					{subtitle && <p className="section-subtitle">{subtitle}</p>}
				</div>
			</div>
			<div className="card p-5">{children}</div>
		</section>
	);
}

function Doctors() {
	const [loading, setLoading] = useState(true);
	const [doctors, setDoctors] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		let mounted = true;
		axios
			.get('/api/doctors')
			.then((res) => {
				if (mounted) {
					setDoctors(res.data || []);
					setLoading(false);
				}
			})
			.catch((err) => {
				setError(err?.message || 'Failed to load doctors');
				setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-6 h-6 animate-spin text-brand-600" />
			</div>
		);
	}
	if (error) {
		return <div className="text-red-600">{error}</div>;
	}
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
			{doctors.map((d) => (
				<article key={d._id} className="card p-4 flex flex-col">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="text-lg font-semibold text-slate-900">
								{d.name}
							</h3>
							<p className="text-slate-600">{d.specialty}</p>
						</div>
						<span
							className={`badge ${
								d.available?.toLowerCase() === 'yes'
									? 'bg-green-100 text-green-700'
									: 'bg-orange-100 text-orange-700'
							}`}
						>
							{d.available ? d.available : 'N/A'}
						</span>
					</div>
					<div className="mt-3 text-sm text-slate-700">
						<p>Experience: {d.experience}</p>
						<p>Rating: {d.rating ?? 0}/5</p>
						<p className="mt-1">
							Qualifications:{' '}
							{Array.isArray(d.qualifications)
								? d.qualifications.join(', ')
								: '—'}
						</p>
					</div>
					<div className="mt-3 text-sm text-slate-600">
						<p>Email: {d.email}</p>
						<p>Phone: {d.phone}</p>
					</div>
				</article>
			))}
			{doctors.length === 0 && (
				<div className="text-slate-600">No doctors yet.</div>
			)}
		</div>
	);
}

function HealthTips() {
	const [tips, setTips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		axios
			.get('/api/health-tips')
			.then((res) => {
				setTips(res.data || []);
				setLoading(false);
			})
			.catch((err) => {
				setError(err?.message || 'Failed to load health tips');
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-6 h-6 animate-spin text-brand-600" />
			</div>
		);
	}
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="grid md:grid-cols-2 gap-5">
			{tips.map((t) => (
				<article key={t._id} className="card p-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-slate-900">
							{t.title}
						</h3>
						<span className="badge bg-slate-100 text-slate-700">
							{t.category}
						</span>
					</div>
					<p className="mt-2 text-slate-700">{t.content}</p>
				</article>
			))}
			{tips.length === 0 && (
				<div className="text-slate-600">No health tips yet.</div>
			)}
		</div>
	);
}

function Symptoms() {
	const [symptoms, setSymptoms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		axios
			.get('/api/symptoms')
			.then((res) => {
				setSymptoms(res.data || []);
				setLoading(false);
			})
			.catch((err) => {
				setError(err?.message || 'Failed to load symptoms');
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-6 h-6 animate-spin text-brand-600" />
			</div>
		);
	}
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<ul className="grid md:grid-cols-2 gap-5">
			{symptoms.map((s) => (
				<li key={s._id} className="card p-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-slate-900">
							{s.name}
						</h3>
						<span
							className={`badge ${
								s.severity === 'high'
									? 'bg-red-100 text-red-700'
									: s.severity === 'medium'
									? 'bg-yellow-100 text-yellow-700'
									: 'bg-green-100 text-green-700'
							}`}
						>
							{s.severity}
						</span>
					</div>
					<p className="mt-2 text-slate-700">{s.description}</p>
					<p className="mt-1 text-slate-600">
						<span className="font-medium">Advice:</span> {s.advice}
					</p>
				</li>
			))}
			{symptoms.length === 0 && (
				<div className="text-slate-600">No symptoms yet.</div>
			)}
		</ul>
	);
}

function BookAppointment() {
	const [doctors, setDoctors] = useState([]);
	const [loadingDoctors, setLoadingDoctors] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [form, setForm] = useState({
		patientName: '',
		age: '',
		phone: '',
		email: '',
		symptoms: '',
		date: '',
		time: '',
		doctorId: '',
	});

	useEffect(() => {
		axios
			.get('/api/doctors')
			.then((res) => {
				setDoctors(res.data || []);
				setLoadingDoctors(false);
			})
			.catch((err) => {
				setError(err?.message || 'Failed to load doctors');
				setLoadingDoctors(false);
			});
	}, []);

	const canSubmit = useMemo(() => {
		return (
			form.patientName &&
			form.age &&
			form.phone &&
			form.email &&
			form.symptoms &&
			form.date &&
			form.time &&
			form.doctorId
		);
	}, [form]);

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		setMessage('');
		setError('');
		axios
			.post('/api/appointments', {
				...form,
				age: Number(form.age),
			})
			.then(() => {
				setMessage('Appointment created successfully.');
				setSubmitting(false);
				setForm({
					patientName: '',
					age: '',
					phone: '',
					email: '',
					symptoms: '',
					date: '',
					time: '',
					doctorId: '',
				});
			})
			.catch((err) => {
				setError(
					err?.response?.data?.message ||
						err?.message ||
						'Failed to create appointment'
				);
				setSubmitting(false);
			});
	}

	return (
		<form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
			<div>
				<label className="label">Patient Name</label>
				<input
					name="patientName"
					value={form.patientName}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div>
				<label className="label">Age</label>
				<input
					name="age"
					type="number"
					min="0"
					value={form.age}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div>
				<label className="label">Phone</label>
				<input
					name="phone"
					value={form.phone}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div>
				<label className="label">Email</label>
				<input
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div className="md:col-span-2">
				<label className="label">Symptoms</label>
				<textarea
					name="symptoms"
					value={form.symptoms}
					onChange={handleChange}
					className="input"
					rows={3}
				/>
			</div>
			<div>
				<label className="label">Date</label>
				<input
					name="date"
					type="date"
					value={form.date}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div>
				<label className="label">Time</label>
				<input
					name="time"
					type="time"
					value={form.time}
					onChange={handleChange}
					className="input"
				/>
			</div>
			<div className="md:col-span-2">
				<label className="label">Doctor</label>
				<select
					name="doctorId"
					value={form.doctorId}
					onChange={handleChange}
					className="input"
				>
					<option value="">Select doctor</option>
					{doctors.map((d) => (
						<option key={d._id} value={d._id}>
							{d.name} — {d.specialty}
						</option>
					))}
				</select>
				{loadingDoctors && (
					<div className="mt-2 text-sm text-slate-600">
						Loading doctors…
					</div>
				)}
			</div>
			{message && (
				<div className="md:col-span-2 rounded-md bg-green-50 text-green-700 p-3">
					{message}
				</div>
			)}
			{error && (
				<div className="md:col-span-2 rounded-md bg-red-50 text-red-700 p-3">
					{error}
				</div>
			)}
			<div className="md:col-span-2 flex justify-end">
				<button disabled={!canSubmit || submitting} className="btn-primary">
					<Calendar className="w-4 h-4" />
					<span>{submitting ? 'Submitting…' : 'Create Appointment'}</span>
				</button>
			</div>
		</form>
	);
}

function App() {
	const [tab, setTab] = useState('doctors');
	return (
		<div className="min-h-screen">
			<Header current={tab} onChange={setTab} />
			{tab === 'doctors' && (
				<Section
					title="Available Doctors"
					subtitle="Browse and choose the right specialist"
					icon={Stethoscope}
				>
					<Doctors />
				</Section>
			)}
			{tab === 'book' && (
				<Section
					title="Book Appointment"
					subtitle="Fill in details to schedule a consultation"
					icon={Calendar}
				>
					<BookAppointment />
				</Section>
			)}
			{tab === 'symptoms' && (
				<Section
					title="Common Symptoms"
					subtitle="Descriptions and advice for common issues"
					icon={NotebookPen}
				>
					<Symptoms />
				</Section>
			)}
			{tab === 'tips' && (
				<Section
					title="Health Tips"
					subtitle="Evidence-based good practices"
					icon={HeartPulse}
				>
					<HealthTips />
				</Section>
			)}
			<footer className="section pb-8 text-sm text-slate-500">
				<div className="border-t border-slate-200 pt-4">
					© {new Date().getFullYear()} Doctor Consultation
				</div>
			</footer>
		</div>
	);
}

export default App;

