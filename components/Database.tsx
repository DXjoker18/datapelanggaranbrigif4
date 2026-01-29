
import React, { useState } from 'react';
import { ViolationRecord, UserRole } from '../types';
import { UNIT_LOGO } from '../constants';

interface DatabaseProps {
  data: ViolationRecord[];
  role: UserRole;
  onEdit: (record: ViolationRecord) => void;
  onDelete: (id: string) => void;
}

const Database: React.FC<DatabaseProps> = ({ data, role, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ViolationRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ViolationRecord | null>(null);

  const filtered = data.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.nrp.includes(search) ||
    d.satuan.toLowerCase().includes(search.toLowerCase()) ||
    d.perkara.toLowerCase().includes(search.toLowerCase()) ||
    (d.ketTindakan && d.ketTindakan.toLowerCase().includes(search.toLowerCase()))
  );

  const downloadSinglePDF = (record: ViolationRecord) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: 'Arial', sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid #2d3a2a; padding-bottom: 20px; margin-bottom: 30px;">
          <img src="${UNIT_LOGO}" style="width: 80px; height: 80px; margin-bottom: 10px;" />
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; color: #1a2418;">Kartu Data Pelanggaran Hukum</h1>
          <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: bold; color: #666;">BRIGADE INFANTERI 4/DEWA RATNA</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; width: 150px;">Nama Lengkap</td>
            <td style="padding: 10px 0;">: ${record.nama}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Pangkat / NRP</td>
            <td style="padding: 10px 0;">: ${record.pangkat} / ${record.nrp}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Jabatan / Satuan</td>
            <td style="padding: 10px 0;">: ${record.jabatan} / ${record.satuan}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Jenis Perkara</td>
            <td style="padding: 10px 0;">: ${record.perkara}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Tanggal Kejadian</td>
            <td style="padding: 10px 0;">: ${record.tanggal}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Status Hukum</td>
            <td style="padding: 10px 0;">: ${record.status} ${record.ketTindakan ? `(${record.ketTindakan})` : ''}</td>
          </tr>
        </table>

        <div style="margin-top: 30px;">
          <h3 style="font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2d3a2a; display: inline-block; padding-bottom: 2px;">Kronologis Singkat:</h3>
          <p style="font-size: 12px; line-height: 1.6; text-align: justify; color: #333; margin-top: 10px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${record.kronologis}
          </p>
        </div>

        <div style="margin-top: 50px; text-align: right;">
          <p style="font-size: 12px;">Dikeluarkan secara sistem pada: ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Data_Hukum_${record.nama.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const downloadAllPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 30px; font-family: 'Arial', sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 18px; text-transform: uppercase; margin: 0;">Rekapitulasi Pelanggaran Hukum</h1>
          <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">BRIGADE INFANTERI 4/DEWA RATNA</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
          <thead>
            <tr style="background: #2d3a2a; color: white;">
              <th style="border: 1px solid #ddd; padding: 8px;">No</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Nama / Pkt / NRP</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Satuan</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Perkara</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.nama}<br><span style="color: #666;">${item.pangkat} / ${item.nrp}</span></td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.satuan}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.perkara}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.status}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.tanggal}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 20px; text-align: right; font-size: 9px;">
          Dicetak pada: ${new Date().toLocaleString('id-ID')}
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Rekap_Pelanggaran_Brigif4DR_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Database Personel</h2>
          <p className="text-[10px] font-bold text-accent uppercase">{filtered.length} DATA DITEMUKAN</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={downloadAllPDF}
            className="army-gradient text-white text-[9px] px-4 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fas fa-file-export"></i> Rekap PDF
          </button>
          <div className="relative flex-1 max-w-xs">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Cari Data..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-accent text-[11px] font-bold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 army-gradient rounded-2xl flex items-center justify-center text-white font-bold uppercase text-[9px] shadow-inner">
                {item.pangkat.substring(0, 3)}
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-800 uppercase leading-tight">{item.nama}</h4>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">{item.pangkat} / {item.nrp} - {item.satuan}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    item.status === 'Selesai' ? 'bg-accent-light text-accent-dark' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.status}
                  </span>
                  {item.status === 'Proses Hukum' && item.ketTindakan && (
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold uppercase">
                      {item.ketTindakan}
                    </span>
                  )}
                  <span className="text-[8px] font-bold text-gray-300 uppercase">{item.perkara}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setSelectedRecord(item)}
                className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <i className="fas fa-eye text-xs"></i>
              </button>
              {role === 'admin' && (
                <>
                  <button 
                    type="button"
                    onClick={() => onEdit(item)}
                    className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 hover:bg-blue-100 transition-colors"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  {item.status === 'Selesai' && (
                    <button 
                      type="button"
                      onClick={() => setRecordToDelete(item)}
                      className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center opacity-20">
          <i className="fas fa-folder-open text-5xl mb-4"></i>
          <p className="font-black uppercase tracking-[0.3em]">Tidak Ada Data</p>
        </div>
      )}

      {recordToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-pop text-center">
            <div className="bg-red-600 p-6 text-white">
              <i className="fas fa-exclamation-triangle text-4xl mb-3"></i>
              <h3 className="font-black text-sm uppercase tracking-widest">Hapus Data</h3>
            </div>
            <div className="p-8">
              <p className="text-[11px] font-bold text-gray-500 uppercase">Hapus permanen data personel?</p>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-black text-gray-800 uppercase">{recordToDelete.nama}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
              <button type="button" onClick={confirmDelete} className="w-full bg-red-600 text-white text-[10px] py-4 rounded-xl font-black uppercase">Ya, Hapus</button>
              <button type="button" onClick={() => setRecordToDelete(null)} className="w-full bg-white text-gray-400 text-[10px] py-4 rounded-xl font-black uppercase border">Batal</button>
            </div>
          </div>
        </div>
      )}

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[500] flex items-center justify-center p-4 md:p-10">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-pop flex flex-col">
            {/* Header Modal */}
            <div className="army-gradient p-8 text-white relative text-center">
              <div className="absolute top-4 left-6 opacity-20 pointer-events-none">
                <i className="fas fa-shield-halved text-7xl"></i>
              </div>
              <img src={UNIT_LOGO} alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4 bg-white/20 p-2 rounded-2xl shadow-lg border border-white/30" />
              <h2 className="font-black text-lg uppercase tracking-widest leading-none">Detail Perkara Personel</h2>
              <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.4em] opacity-60">Dewa Ratna Intelligence System</div>
            </div>

            {/* Body Modal - Scrollable */}
            <div className="p-8 md:p-10 overflow-y-auto space-y-8 bg-[#fcfdfe] max-h-[70vh]">
              {/* Identitas Section */}
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identitas Personel</h3>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <DetailItem label="Nama Lengkap" value={selectedRecord.nama} icon="fas fa-user-tag" />
                  <div className="grid grid-cols-2 gap-6">
                    <DetailItem label="Pangkat / NRP" value={`${selectedRecord.pangkat} / ${selectedRecord.nrp}`} icon="fas fa-id-card" />
                    <DetailItem label="Satuan Asal" value={selectedRecord.satuan} icon="fas fa-building" />
                  </div>
                  <DetailItem label="Jabatan Terakhir" value={selectedRecord.jabatan} icon="fas fa-briefcase" />
                </div>
              </section>

              {/* Status Section */}
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-6 bg-orange-400 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Perkara</h3>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <DetailItem label="Jenis Perkara" value={selectedRecord.perkara} icon="fas fa-gavel" />
                    <DetailItem 
                      label="Status Hukum" 
                      value={selectedRecord.status} 
                      icon="fas fa-info-circle"
                      highlight={selectedRecord.status === 'Selesai' ? 'text-accent' : 'text-orange-500'} 
                    />
                  </div>
                  <DetailItem label="Tanggal Kejadian" value={selectedRecord.tanggal} icon="fas fa-calendar-day" />
                </div>
              </section>
              
              {/* Tindakan Section */}
              {selectedRecord.ketTindakan && (
                <section className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Keterangan Tindakan</h3>
                  </div>
                  <div className="bg-blue-600 p-6 rounded-3xl shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] text-white">
                    <div className="flex items-start gap-4">
                      <i className="fas fa-clipboard-list text-2xl opacity-50 mt-1"></i>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight leading-tight">{selectedRecord.ketTindakan}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-60 mt-1">Status: Sedang Dijalankan</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Kronologis Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-slate-800 rounded-full"></div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kronologis Singkat</h3>
                </div>
                <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200">
                  <p className="text-xs md:text-sm font-bold text-slate-700 leading-relaxed italic text-justify">
                    <i className="fas fa-quote-left text-slate-300 mr-3"></i>
                    {selectedRecord.kronologis}
                  </p>
                </div>
              </section>
            </div>

            {/* Footer Modal */}
            <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center gap-4">
              <button 
                onClick={() => downloadSinglePDF(selectedRecord)} 
                className="flex-1 bg-accent text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <i className="fas fa-file-pdf"></i> Ekspor PDF
              </button>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase active:scale-95 transition-all hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  label: string; 
  value: string; 
  icon?: string;
  highlight?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon, highlight }) => (
  <div className="group">
    <label className="text-[9px] font-black text-gray-400 uppercase block mb-1.5 tracking-wider">{label}</label>
    <div className="flex items-center gap-3">
      {icon && <i className={`${icon} text-gray-300 text-[10px]`}></i>}
      <p className={`text-sm font-extrabold text-gray-800 transition-colors group-hover:text-accent ${highlight || ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Database;
