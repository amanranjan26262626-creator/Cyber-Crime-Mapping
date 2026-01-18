import { CCTNS_DATA } from './cctns_data';

export const CCTNSService = {
    database: [],

    // Optimized Search Index
    indices: {
        msisdn: new Map(),
        imei: new Map(),
        ip: new Map(),
        email: new Map(),
        name: [] // suffix tree or trie is overkill, array is fine for name includes
    },

    // Optimized Search Index
    // Helper: Normalize Input (Remove +91, dashes, spaces)
    normalize: (str) => {
        if (!str) return '';
        return String(str).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    },

    // Auto-Load Static Data with Indexing
    initializeDatabase: async () => {
        // Immediate Load (No Delay)
        CCTNSService.database = CCTNS_DATA;

        // Reset Indices
        CCTNSService.indices = { msisdn: new Map(), imei: new Map(), ip: new Map(), email: new Map(), id: new Map(), name: [] };

        CCTNS_DATA.forEach(record => {
            // Index Normalized Keys for robust matching
            if (record.MSISDN) CCTNSService.indices.msisdn.set(CCTNSService.normalize(record.MSISDN), record);
            if (record.IMEI) CCTNSService.indices.imei.set(CCTNSService.normalize(record.IMEI), record);
            if (record.IP_Address) CCTNSService.indices.ip.set(record.IP_Address.trim(), record); // IPs keep dots usually, but strict match is okay
            if (record.Email) CCTNSService.indices.email.set(record.Email.toLowerCase().trim(), record);
            if (record.Crime_ID) CCTNSService.indices.id.set(record.Crime_ID.toLowerCase(), record);
            if (record.Suspect_Name) CCTNSService.indices.name.push(record);
        });

        console.log("CCTNS Database Optimized & Loaded: ", CCTNSService.database.length);
        return CCTNSService.database.length;
    },

    // Analytics (Keep existing getAnalytics...)
    getAnalytics: () => {
        const db = CCTNSService.database;
        const totalCases = db.length;

        // 1. Crime Type Distribution
        const crimeTypes = {};
        db.forEach(row => {
            const type = row.Crime_Type || 'Unknown';
            crimeTypes[type] = (crimeTypes[type] || 0) + 1;
        });
        const topCrimes = Object.entries(crimeTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // 2. Location Hotspots
        const locations = {};
        db.forEach(row => {
            let loc = row.Location || 'Unknown';
            locations[loc] = (locations[loc] || 0) + 1;
        });
        const hotspots = Object.entries(locations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // 3. Recent Activity
        const recent = db.slice(-5).reverse();

        return { totalCases, topCrimes, hotspots, recent };
    },

    // ⚡ Hybrid Optimized Search Logic
    search: (query) => {
        // Ensure DB is loaded if search is called before init
        if (CCTNSService.database.length === 0) CCTNSService.initializeDatabase();
        if (!query) return null;

        const rawQ = query.toLowerCase().trim();
        const normQ = CCTNSService.normalize(query); // Stripped version for Phone/IMEI

        let match = null;

        // Phase 1: O(1) Instant Lookup (Using Normalized Keys)
        if (CCTNSService.indices.msisdn.has(normQ)) match = CCTNSService.indices.msisdn.get(normQ);
        else if (CCTNSService.indices.imei.has(normQ)) match = CCTNSService.indices.imei.get(normQ);
        else if (CCTNSService.indices.ip.has(rawQ)) match = CCTNSService.indices.ip.get(rawQ); // IPs usually matched exact or partial
        else if (CCTNSService.indices.email.has(rawQ)) match = CCTNSService.indices.email.get(rawQ);
        else if (CCTNSService.indices.id.has(rawQ)) match = CCTNSService.indices.id.get(rawQ); // ID Lookup

        // Phase 2: Fallback to Linear Scan (Partial/Fuzzy Matches)
        if (!match) {
            // Name Search (Contains)
            match = CCTNSService.indices.name.find(r => r.Suspect_Name.toLowerCase().includes(rawQ));

            // Universal Partial Search (Deep Scan)
            if (!match) {
                match = CCTNSService.database.find(r => {
                    const normMSISDN = CCTNSService.normalize(r.MSISDN);
                    const normIMEI = CCTNSService.normalize(r.IMEI);

                    return (normMSISDN.includes(normQ) && normQ.length > 5) ||
                        (normIMEI.includes(normQ) && normQ.length > 5) ||
                        (r.IP_Address && r.IP_Address.includes(rawQ)) ||
                        (r.Crime_ID && r.Crime_ID.toLowerCase() === rawQ);
                });
            }
        }


        if (match) {
            // 2. Find Correlations with REASON tracking
            const related = [];
            CCTNSService.database.forEach(r => {
                if (r.Crime_ID === match.Crime_ID) return;

                let reason = null;
                // Check all connection types
                if (r.IP_Address && match.IP_Address && r.IP_Address === match.IP_Address) reason = 'IP';
                else if (CCTNSService.normalize(r.IMEI) === CCTNSService.normalize(match.IMEI)) reason = 'IMEI'; // Robust match
                // Removed Email Link as per user request (Too broad)
                else if (r.Location && match.Location && r.Location === match.Location && r.Crime_Type === match.Crime_Type) reason = 'Location_Pattern';

                if (reason) {
                    related.push({ ...r, matchReason: reason });
                }
            });

            return {
                matchFound: true,
                record: match,
                relatedRecords: related,
                confidence: 98
            };
        }

        return { matchFound: false };
    },

    // Generate Graph Data for vis-network
    generateGraphData: (searchResult) => {
        if (!searchResult || !searchResult.matchFound) return null;

        const nodes = [];
        const edges = [];
        const addedNodes = new Set();

        const addNode = (id, label, group, color) => {
            if (!id) return; // Guard
            if (!addedNodes.has(id)) {
                nodes.push({ id, label, group, color, font: { color: 'white' } });
                addedNodes.add(id);
            }
        };

        const target = searchResult.record;

        // Target Node
        addNode(target.Crime_ID, target.Suspect_Name, 'suspect', '#f43f5e');

        // Always add Attributes for Target
        if (target.IP_Address) { addNode(target.IP_Address, target.IP_Address, 'ip', '#3b82f6'); edges.push({ from: target.Crime_ID, to: target.IP_Address }); }
        if (target.MSISDN) { addNode(target.MSISDN, target.MSISDN, 'mobile', '#10b981'); edges.push({ from: target.Crime_ID, to: target.MSISDN }); }
        if (target.Location) { addNode(target.Location, target.Location, 'location', '#f59e0b'); edges.push({ from: target.Crime_ID, to: target.Location }); }
        if (target.IMEI) { addNode(target.IMEI, target.IMEI, 'device', '#8b5cf6'); edges.push({ from: target.Crime_ID, to: target.IMEI }); }
        if (target.Email) {
            const domain = target.Email.split('@')[1];
            if (domain && !['gmail.com', 'yahoo.co.in', 'zohomail.com', 'outlook.in', 'outlook.com', 'hotmail.com', 'rediffmail.com'].includes(domain)) {
                addNode(domain, domain, 'email_domain', '#a855f7');
                edges.push({ from: target.Crime_ID, to: domain });
            }
        }


        // Related Nodes - using Explicit Reason
        searchResult.relatedRecords.forEach(rel => {
            addNode(rel.Crime_ID, rel.Suspect_Name, 'suspect', '#fb923c');

            // Draw link based on the detected reason
            if (rel.matchReason === 'IP') {
                edges.push({ from: rel.Crime_ID, to: rel.IP_Address });
            }
            else if (rel.matchReason === 'IMEI') {
                // Ensure IMEI node exists (it should, from target, but if target doesn't have it match logic would fail, so safe)
                addNode(rel.IMEI, rel.IMEI, 'device', '#8b5cf6');
                edges.push({ from: rel.Crime_ID, to: rel.IMEI });
            }
            else if (rel.matchReason === 'Location_Pattern') {
                // Link to Location
                edges.push({ from: rel.Crime_ID, to: rel.Location });
            }
            // Email Domain Link Removed per user request
        });

        // --- INFLUENCE RANKER (Degree Centrality) ---
        // 1. Calculate Edge Counts (Degree)
        const nodeDegrees = new Map();
        edges.forEach(edge => {
            nodeDegrees.set(edge.from, (nodeDegrees.get(edge.from) || 0) + 1);
            nodeDegrees.set(edge.to, (nodeDegrees.get(edge.to) || 0) + 1);
        });

        // 2. Apply Sizing (Base Size 20 + (Degree * 5))
        nodes.forEach(node => {
            const degree = nodeDegrees.get(node.id) || 0;
            // Target is always prominent
            if (node.id === target.Crime_ID) {
                node.size = 35 + (degree * 2); // Bigger Base
            } else {
                node.size = 15 + (degree * 3); // Dynamic scaling
            }

            // Visual feedback for High Influence Nodes (Kingpins)
            if (degree > 5) {
                node.font = { size: 16, color: '#fca5a5', face: 'bold' }; // Highlight label
                node.shadow = { enabled: true, color: 'rgba(239, 68, 68, 0.5)', size: 10 }; // Red Glow
            }
        });

        // --- COMMUNITY CLUSTERING (Gang Detection - BFS) ---
        // Identify connected components
        const visited = new Set();
        let clusterCount = 0;
        const clusterColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']; // Gang colors

        const adjacency = new Map();
        // Build adjacency list
        edges.forEach(e => {
            if (!adjacency.has(e.from)) adjacency.set(e.from, []);
            if (!adjacency.has(e.to)) adjacency.set(e.to, []);
            adjacency.get(e.from).push(e.to);
            adjacency.get(e.to).push(e.from);
        });

        nodes.forEach(node => {
            // Only cluster suspects and their direct assets
            if (!visited.has(node.id)) {
                clusterCount++;
                const queue = [node.id];
                visited.add(node.id);
                const color = clusterColors[clusterCount % clusterColors.length];

                while (queue.length > 0) {
                    const current = queue.shift();
                    // Assign Cluster Data
                    const n = nodes.find(x => x.id === current);
                    if (n) {
                        n.clusterId = clusterCount;
                        // Optional: detailed coloring for gangs?
                        // Keep Target Red, but maybe tint the border?
                        // For now, let's just tag them for the Alias Fusion logic.
                    }

                    const neighbors = adjacency.get(current) || [];
                    neighbors.forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                        }
                    });
                }
            }
        });

        // --- ALIAS FUSION (Entity Resolution) ---
        // Check suspects in the same cluster for similar names
        const suspects = nodes.filter(n => n.group === 'suspect');
        suspects.forEach(s1 => {
            suspects.forEach(s2 => {
                if (s1.id !== s2.id && s1.clusterId === s2.clusterId) {
                    // Check Name Similarity (Simple includes check for now)
                    const n1 = s1.label.toLowerCase();
                    const n2 = s2.label.toLowerCase();
                    if ((n1.length > 4 && n2.includes(n1)) || (n2.length > 4 && n1.includes(n2))) {
                        // Found Alias!
                        // Draw a special "Identity Link"
                        edges.push({
                            from: s1.id,
                            to: s2.id,
                            color: { color: '#a855f7', opacity: 0.6 },
                            dashes: [5, 5],
                            label: 'POSSIBLE ALIAS',
                            font: { size: 9, background: 'white' }
                        });
                    }
                }
            });
        });

        // --- LINK PREDICTION (Triadic Closure Heuristic) ---
        // If Node A and Node B share a neighbor, and match on Crime Type, suggest link.
        // Simplified: If two suspects share a specific resource (Sequence of edges), they are linked.
        // Actually best implemented as: If A linked to Mobile X, and B linked to Mobile X -> A and B are linked.
        // The graph already shows this via the middle node.
        // Real Link Prediction: "Possible Direct Connection"
        // Let's iterate suspects. If they share > 1 intermediate node, draw a "Predicted" dashed line.

        const suspectNodes = nodes.filter(n => n.group === 'suspect');
        for (let i = 0; i < suspectNodes.length; i++) {
            for (let j = i + 1; j < suspectNodes.length; j++) {
                const s1 = suspectNodes[i];
                const s2 = suspectNodes[j];

                // Find shared neighbors
                const neighbors1 = edges.filter(e => e.from === s1.id || e.to === s1.id).map(e => e.from === s1.id ? e.to : e.from);
                const neighbors2 = edges.filter(e => e.from === s2.id || e.to === s2.id).map(e => e.from === s2.id ? e.to : e.from);

                const shared = neighbors1.filter(n => neighbors2.includes(n));

                // If they share 2 or more data points (e.g. Same IP AND Same Location), Predict Link
                if (shared.length >= 2) {
                    edges.push({
                        from: s1.id,
                        to: s2.id,
                        dashes: true,
                        color: { color: '#ef4444' }, // Red Dashed
                        label: 'AI PREDICTED LINK',
                        font: { size: 10, align: 'middle' }
                    });
                }
            }
        }

        return { nodes, edges };
    },

    // 6. Real Gemini AI Integration
    generateRealAI: async (searchResult) => {
        // ⚠️ PASTE YOUR GEMINI API KEY HERE
        const API_KEY = "AIzaSyD0hwSiSegY9bnaEIjLFOlzhq1nsJGF_gQ";

        if (!searchResult || !searchResult.matchFound || API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            console.warn("Using Local AI (No API Key or Invalid Data)");
            return CCTNSService.generateIntelligenceBrief(searchResult); // Fallback to Local
        }

        try {
            const r = searchResult.record;
            const related = searchResult.relatedRecords;

            const prompt = `
                You are a Senior Cyber Intelligence Officer (CCTNS). Analyze this criminal record and generate a strict, professional intelligence brief.
                
                TARGET:
                Name: ${r.Suspect_Name}
                Crime: ${r.Crime_Type}
                Location: ${r.Location}
                Mobile: ${r.MSISDN}
                Linked Suspects Count: ${related.length}
                
                NETWORK DATA:
                Linked Criminals: ${related.map(x => x.Suspect_Name + " (" + x.Crime_Type + ")").join(", ")}
                
                OUTPUT FORMAT:
                **INTELLIGENCE BRIEFING**
                **Assessment**: [Summarize the threat level and gang involvement]
                **Network Analysis**: [Describe the connections and pattern]
                **Tactical Recommendation**: [Specific action for police]
                
                Keep it under 100 words. Use emojis suitable for a dashboard.
            `;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("Gemini API Failed:", error);
            // Alert the user so they KNOW it tried but failed
            alert(`Gemini API Error: ${error.message || error}`);
            return CCTNSService.generateIntelligenceBrief(searchResult).replace("OFFLINE INTELLIGENCE SUMMARY", "⚠️ API FAILED - USING LOCAL BACKUP");
        }
    },

    // 7. Auto-Generated Intelligence Brief (Local Fallback)
    generateIntelligenceBrief: (searchResult) => {
        if (!searchResult || !searchResult.matchFound) return null;
        const r = searchResult.record;

        // ... (Existing Template Logic)
        const crimeType = r.Crime_Type.toUpperCase();
        const loc = r.Location;
        const linkedCount = searchResult.relatedRecords.length;

        // Dynamic Template
        let brief = `**⚠️ OFFLINE INTELLIGENCE SUMMARY (Local Mode)**\n\n`;
        brief += `**Subject**: ${r.Suspect_Name} (ID: ${r.Crime_ID}) identified as High-Priority Target in **${crimeType}**.\n\n`;
        brief += `**Network Status**: Central node of a ${linkedCount + 1}-member cluster active in **${loc}**. `;

        if (linkedCount > 2) brief += `\n🚨 **Gang Affiliation**: Strong correlation with known offenders implies organized syndicate operations.`;

        brief += `\n\n**Action**: Monitor IMEI ${r.IMEI} and intercept comms.`;

        return brief;
    }
};
