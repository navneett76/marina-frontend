// src/components/ContractPreview.tsx
import React from 'react';
import { Customer } from '../Common/types/Customer';
// import "./ContractPreview.css";
import { parseISO, format, isValid, parse } from 'date-fns';


interface ContractPreviewProps {
    customer: Customer;
}

const ContractPreviewIndoorStorage: React.FC<ContractPreviewProps> = ({customer }) => {

    const formatDateString = (dateString: string) => {
        let date;
    
        // Check if the input is just a time (e.g., "08:00")
        if (/^\d{2}:\d{2}$/.test(dateString)) {
          // If it's a time, combine it with the current date
          const today = new Date();
          date = parse(`${today.toISOString().split('T')[0]}T${dateString}`, "yyyy-MM-dd'T'HH:mm", new Date());
        } else {
          // Otherwise, parse it as a full ISO date string
          date = parseISO(dateString);
        }
    
        // Validate the date
        if (!isValid(date)) {
          throw new Error('Invalid date value');
        }
    
        return format(date, 'MM/dd/yyyy');
      };

    return (
        <>
            <div className="invoice-container">
                        <header className='invoice-header'>
                            <img src='../../../logo.png' alt="Logo" className="invoice-logo" /> 
                            <div className="ship-address">
                                <h1>{customer.port.portName}</h1>
                                <p>{customer.companyAddress}</p>
                                <p>(860)556-2000</p>
                            </div>
                        </header>
                        <section className='invoice-details'>
                            <div className='invoice-first-child'>
                                <h2>Contact</h2>
                                <p><strong>{customer.fname} {customer.lname} </strong></p>
                                {/* <p>Phone: {customer.phone}</p> */}
                                <p>{customer.address1} {customer.address2} {customer.city} {customer.state} {customer.zip} {customer.country}</p>
                                <p>{customer.email}</p>
                                
                            </div>
                            <div className='invoice-second-child'>
                                <h2>Vessel</h2>
                                <p>Vessel: {customer.vessel}</p>
                                <p>LOA / Beam / Draft: {customer.loa} ' / {customer.beam} ' / {customer.draft} '</p>
                                <p>Make</p>
                                <p>Model</p>
                                <p>Registration Number: </p>
                            </div>
                        </section>
                        <section className='invoice-details'>
                            <div className='invoice-first-child'>
                                <h2>Arrival Time</h2>
                                <p>Scheduled Arrival Date {formatDateString( customer.starttime)}</p>
                            </div>
                            <div className='invoice-second-child'>
                                <h2>Departure Time</h2>
                                <p>Scheduled Departure Date: {formatDateString(customer.endtime)}</p>
                            </div>
                        </section>
                        <section className='invoice-details'>
                        <div className=''>
                        <h3 style={{margin:'20px'}}>Amount: {customer.price}</h3>
                        </div>
                        </section>
                        <section style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                            <h2>Terms and Conditions</h2>
                            <h2>10% non-refundable deposit is due upon signing this contract.</h2>
                            <h2>Please return this contract by November 15th.</h2>
                            <h2>Remaning payments must be made on or before January 15th and March 15th, 2024.</h2>
                            <h2>All summer slips must be paid in full by March 15, 2024. TERMS OF AGREEMENT</h2>
                            <p><strong>DEFINITIONS.</strong>  In this Slip Rental Agreement (hereinafter "Agreement"), "Owner" shall mean the person(s)
                                whose name(s) and address(es) are shown as such above. "Owner" shall indicate the singular and the plural.
                                "Boat" shall indicate the vessel identified above or any substitute vessel agreed upon by the parties in writing.
                                Owner warrants that they are either the owner of the Boat or that they are duly authorized by the owner of the
                                Boat to enter into this Slip Rental Agreement as agent for the owner and to bind themselves, the owner, and the
                                Boat to the terms and conditions stated herein. "Marina" shall mean Noank Shipayard, 145 Pearl Street, Noank,
                                CT 06340.
                            </p>
                            <p><strong>RENT.</strong>  Owner agrees to pay rent in full set forth in the agreement and is due on the start date of the contract.
                                Charges for goods or services provided to Owner or their Boat by Marina shall be considered additional Rent
                                and will be invoiced in addition to the amounts specified in the Payment Terms. In the event any installment of
                                rent or other charges due in accordance with this Agreement are not paid within 10 days of the date of the
                                invoice sent by Marina to Owner, Owner agrees to pay Marina a 5% late fee on the overdue amount, as well as a
                                finance charge equal to the lesser of the highest rate allowed by law or 2% per month (24% APR) on the unpaid
                                balance due until paid, accruing from the invoice date.
                            </p>
                            <p><strong>TERM.</strong>  Slip Rental Agreement will begin on the start date and end on the end date set forth on the cover sheet of
                                the agreement.
                            </p>
                            <p><strong>SLIP ASSIGNMENT.</strong> Subject to the rights of Marina hereunder Owner shall have a license upon the terms and
                                condition hereunder use the slip assigned to Owner by Marina, provided Owner is not in default under any
                                provision of this Agreement. The slip shall be used solely for the purpose of mooring the Boat (one vessel)
                                within the slip. Owner acknowledges that no business of any kind may be conducted from the Slip without the
                                written permission of Marina. Owner acknowledges that no boat other than the Boat described above, may be
                                substituted without the prior written approval of Marina. Owner acknowledges that the Slip may not be sublet
                                nor may this Agreement or any rights hereunder be assigned by Owner without the prior written consent of
                                Marina, which may be given or withheld in Marina's sole discretion. Marina may move the Boat to any other slip
                                in the Marina if it is deemed necessary by Marina at its sole discretion and at any time. Owner agrees that they
                                will promptly comply with any written request made by Marina and sent to Owner by first class mail (with copy
                                via email) that Owner remove the Boat and all personal property from the assigned slip. In the event it is
                                necessary for Marina to remove the Boat and/or Owner's property from the slip, Owner agrees to pay all charges
                                for moving, hauling, land storage, and launching as invoiced by Marina.
                            </p>
                            <p><strong>RULES.</strong>  Owner agrees to use and occupy the Slip strictly in accordance with the terms and conditions of this
                                Agreement and the Marina Rules, which are posted at the office maintained at the Marina by the Owner, may be
                                published, or modified by Marina at any time, and at the sole discretion of Marina. Owner acknowledges that
                                they have received and reviewed a copy of the Marina Rules in effect at the time of signing this Agreement.
                            </p>
                            <p><strong>DUTIES OF OWNER/CONDITION OF VESSELS.</strong> The Marina shall have the authority to set standards of
                                appearance and serviceability for boats moored within the Marina basin or stored in Dry Slips. Owner agrees to
                                maintain his or her Boat in accordance with such standards and the Marina shall, at the sole discretion of
                                Marina, have the right to expel any Boat from the Marina which does not meet its standards of appearance,
                                maintenance, or safety. Owner agrees that the Boat shall be properly documented or registered and show all
                                required markings/decals and Owner agrees to promptly provide Marina with a copy of the Boat's registration,
                                title and documentation upon request by Marina. Owner agrees that it is Owner's sole duty to keep the Boat
                                properly secured and moored at all times; to keep the Boat tight (bilges dry), staunch and seaworthy; to keep the
                                Boat in good operating condition and repair; to keep the Boat neat, clean, and free of rust, mildew, peeling paint,
                                rot, blistering, and flaking; to equip the Boat with adequate mooring lines and fenders in strong, clean and
                                satisfactory condition; and to keep the Boat with a neat, shipshape and aesthetically pleasing
                                appearance. Owner's compliance with the standards referred to in this paragraph shall be determined at the
                                sole discretion of Marina. Owner acknowledges that the Slip is not to be used for the long-term storage (over 30
                                consecutive days) of an inoperable boat. In the event that it is determined by Marina that Owner or Boat is not in
                                compliance with the requirements of this paragraph, Marina may terminate this Agreement for cause.
                            </p>
                            <p><strong>COMMON AREAS.</strong> Provided Owner complies with their duties and obligations hereunder, Marina hereby grants
                                Owner a non-exclusive license to use of the docks, promenade, parking areas, picnic areas, restrooms, lounge
                                facilities and other common areas within the Marina which are designated for general use by Owner and Owner's
                                guests, subject to the Marina Rules and requirements set forth in this Agreement. Owner agrees that neither they
                                nor their guests or invitees will place or leave any objects upon the docks and finger piers or other common
                                areas of the Marina without the express permission of the Marina. Owner may not attach anything to the docks
                                or make any alterations to the docks or finger piers or any other common area of the Marina.
                            </p>
                            <p><strong>VACANCY.</strong> Whenever Owner expects their assigned slip to be vacant for more than 24 hours, Owner shall notify
                                the Marina. Marina shall have the right to rent or use the slip for its own purposes at any time it is not occupied
                                by Owner's Boat.
                            </p>
                            <p><strong>CANCELLATION BY OWNER.</strong> In the event of a boat sale the Owner may request that in lieu of cancelling the
                                Agreement, Owner be permitted to assign its rights and obligations under this Agreement to the new owner of
                                the Boat, but only with the express consent and approval of Marina, which may be given or withheld in Marina's
                                sole discretion. If Owner cancels this Agreement prior to the end of the Term, they will not receive any pro-ration
                                on any fees or refunds of any amounts prepaid by Owner.
                            </p>
                            <p><strong>0. TERMINATION WITHOUT CAUSE.</strong> Marina may elect, at its sole option, to terminate this Agreement at any time
                                for any reason or no reason. In such event, Marina shall send Owner written notice of termination by first class
                                mail to the address written above (or to any new address provided by Owner to Marina in writing). In such event,
                                once Owner has removed the Boat from the Slip, Marina shall refund to Owner the pro-rated charges from the
                                date of termination to the end of the current term of this Agreement (after deducting any amounts then due by
                                Owner to Marina). In the event Owner does not remove the Boat from the Slip within 10 days after Marina sends
                                the notice, Marina may remove, tow, haul, and store the Boat at Owner's expense and sole risk of loss/damage,
                                and at Marina's then effective daily transient rate.
                            </p>
                            <p><strong>1. TERMINATION FOR CAUSE.</strong> Marina may at its sole discretion, terminate this Agreement for cause, and without
                                any refund to Owner, in the event that Owner fails to pay any of the rental or other fees due under this
                                Agreement when due; in the event Owner breaches any of the terms and conditions of this Agreement; in the
                                event Owner or Owner's guests, invitees, or contractors fail in the sole judgment of the Marina, to abide by the
                                Marina Rules or the terms of this Agreement; or should Owner behave in a manner which, in the sole judgment
                                of Marina, is disorderly, might injure or endanger other persons, damage property, or harm the reputation of the
                                Marina. In the event the Marina exercises its right to terminate this Agreement for cause, it will send written
                                notice to the Owner by certified mail at the address written above (or any new address provided by Owner to
                                Marina in writing), specifying the nature of the default(s) and demanding that the default(s) be corrected within
                                five (5) days of the date notice is sent. In the event the default(s) are not corrected within said time, in the sole
                                judgment of Marina, this Agreement may be terminated by Marina.
                            </p>
                            <p><strong>2. DUTIES UPON END OF TERM/TERMINATION FOR CAUSE/HOLDING OVER.</strong>At the end of the term of this
                                Agreement without renewal or extension, or upon termination of this Agreement for cause, Owner agrees (1) to
                                return the Slip to Marina in its original condition, clean and free of debris; (2) to immediately pay all amounts due
                                to Marina; (3) to surrender all Marina keys and security cards; (4) to remove all parking stickers from their
                                vehicles; and (5) to immediately remove the Boat and all of Owner's personal property from the Marina. Owner
                                agrees that they will not remove the Boat from the Marina after termination or after the end of the Term, until all
                                amounts have been paid to Marina. Until the Boat is removed from the Marina, Owner agrees to pay Marina slip
                                rental at the daily transient rate then in effect at the Marina. In the event Owner shall fail to remove the Boat from
                                the Marina within three (3) days of the end of the term or of the termination for cause becoming effective, Owner
                                authorizes Marina to board the Boat and take possession of any of Owner's other property in or about the
                                Marina, and to remove such Boat or other property at the expense of Owner. Marina may remove the Boat or
                                other property to any other wet or dry storage selected by Marina. Owner agrees to pay all costs and expenses
                                of such removal and continued storage and to reimburse MARINA for all such costs and expenses
                                advanced. Owner further assumes all risks of loss or damage to the Boat and its contents incurred in
                                connection with such removal and/or storage, and hereby releases and agrees to hold TPG Hotels and Resorts,
                                Inc, TPG Spicers Marina and their respective agents, employees, officers, directors, affiliates, managers and
                                representatives (each individually, a "Marina Entity" and collectively, the "Marina Entities") harmless from any
                                liabilities, costs, and expenses incurred in connection therewith, regardless of the nature of the damages, and
                                arising from any cause whatsoever, including but not limited to the negligence (but not gross negligence or
                                willful misconduct) of the Marina Entities. In the event this Agreement is terminated for cause, as set forth
                                above, Owner shall continue to be liable to Marina for all sums remaining payable for the term of this Agreement;
                                and any sums prepaid by Owner to Marina shall be forfeited by Owner and be deemed the sole property of
                                Marina.
                            </p>
                            <p><strong>3. LIMITATION OF LIABILITY.</strong>By entering into this Agreement, Owner acknowledges that he or she is aware of the
                                various types of risks involved in keeping a boat at a Marina. Owner accepts the slip, docks, piers, their
                                appurtenances, and all common areas "as is" and agrees they are in satisfactory condition, safe and suitable for
                                use by Owner and Owner's guests/invitees. Owner agrees that use of the slip, Marina grounds/facilities, parking
                                and other common by Owner, Owner's guests and invitees shall be at their own risk of property loss/damage
                                and/or personal injury/death, arising from any cause whatsoever. Owner further agrees that neither the Marina
                                nor its Affiliates nor their officers, agents, managers, members, attorneys, directors, employees and officers
                                (each a "Marina Entity")shall be liable for any loss, damage or injury to the person or property of Owner or of
                                Owner's guests, invitees or servants, including any loss or damage to Owner's boat, motor vehicle(s), or their
                                contents or equipment, regardless of whether such loss, damage, personal injury or death be occasioned by fire,
                                storm, theft, vandalism, collision, ice, sinking, act of God, or any other cause or condition, including, but not
                                limited to the negligence (but not gross negligence or willful misconduct) of any Marina Entity, and including, but
                                not limited to, any negligence of any Marina Entity in connection with providing voluntary first aid or assistance
                                meant to save lives, treat or avoid injury; dockhand assistance, or mechanical repair. Owner further agrees to
                                indemnify and hold harmless the Marina Entities from and against any claim, action, fine, damages, attorneys
                                fees and costs (whether suit is filed or not) arising from the use of the slip, the Marina grounds/facilities, the
                                parking area, and any other common area at the Marina by Owner, Owner's guests or invitees, arising from any
                                cause whatsoever, including, but not limited to, the negligence (but not gross negligence or willful misconduct)
                                of any Marina Entity. The foregoing notwithstanding, Owner agrees that any judgment entered in favor of Owner
                                against any Marina Entity shall be liquidated to the total amount of Rent received by the Marina from Owner in
                                the applicable year during which the subject claim arose. Owner agrees that any claims for losses, damages, or
                                personal injuries/death arising out of Owner's use of the slip, Marina grounds/facilities, parking area, other
                                common areas or other services provided hereunder must be submitted to Marina in writing within sixty (60)
                                days of the time the Owner knew or should have known of such claims, or such claims shall be forever barred
                                against the Marina Entities. All lawsuits or legal actions against any Marina Entity must be filed within one (1)
                                year of the occurrence that gives rise to such lawsuit or legal action or be forever barred. Owner agrees that in
                                the event Marina conveys its interest in the Slip or assigns its interest in this Agreement, then each party shall
                                be released from all liability or obligations which thereafter arises under this Agreement or activities related to
                                the Marina and Owner shall look only to the transferee of the Slip, or assignee of this Agreement for restitution
                                for damages.
                            </p>
                            <p><strong>4. NO BAILMENT.</strong> Owner acknowledges that the slips, piers, grounds, parking lots and facilities of the Marina are
                                not completely secure and that the Boat and Owner motor vehicle(s) will not be under the exclusive control of
                                the Marina at any time. Access to boats and piers in the Marina is unrestricted from the water, a sidewalk follows
                                the sea wall, there is no guarantee that controlled access gates will perform properly, or that a security guard
                                will be present. Owner acknowledges the Marina are not insurers of the safety, security, or condition of the Boat,
                                the Owner's vehicle(s), or their contents. Owner agrees that the Marina is not a bailee or warehousemen with
                                respect to the Boat, the Owner's vehicle(s), or their contents.
                            </p>
                            <p><strong>5. INSURANCE.</strong> Owner agrees at all times to keep the Boat and its contents covered by a policy of all risks hull
                                insurance in an amount equal to the actual value of the Boat and its contents. Unless MARINA, at its sole
                                discretion, requires in writing higher or lower limits of coverage, Owner also agrees to keep the Boat covered at
                                all times by a policy of protection and indemnity or liability insurance, including pollution/fuel spill coverage,
                                with minimum limits of at least $500,000 per occurrence. Owner agrees to cause such Marina Entities as required
                                by the Marina, TPG Hotels and Resorts, Inc, and Noank Shipyard to be named as an additional insured on all
                                such policies of insurance without limitations or exclusions different from Owner and to present Marina with the
                                Certificate of Insurance prior to using the Slip, and upon every renewal hereof. The Owner hereby waives all
                                rights of subrogation with respect to the Marina. Continuation of this agreement despite any failure by the Owner
                                to provide such Certificate to Marina, and despite the failure of Owner to cause the Marina Parties to be named
                                as an additional insured, shall not be considered waivers of such requirements by Marina.
                            </p>
                            <p><strong>6. CONTRACT WORK.</strong> Owner may hire outside contractors to provide service labor, repairs and parts to the Boat
                                provided that all such contractors meet the requirements of Marina as to quality of workmanship, appearance
                                while present at the Marina, insurance coverage and other requirements reasonably imposed by Marina. Owner
                                agrees not to allow the performance of any maintenance, repairs, replacement of parts or other general labor
                                without first notifying the Marina of the name of the contractor(s) who will perform the work and until the
                                contractor(s) has executed required waivers and indemnities and has been otherwise approved by Marina.
                            </p>
                            <p><strong>7. COLLECTION.</strong> In the event it becomes necessary for Marina to file suit or assign unpaid invoice(s) to an
                                attorney, individual or firm for collection, Owner agrees to pay a reasonable attorneys' fee or collection fee which
                                is agreed to be the greater of actual costs or one third (1/3) of the total outstanding balance due at the time said
                                collection action takes place (but not less than $300.00), plus all applicable court costs and expenses of such
                                collection efforts. Marina shall have a lien pursuant to appropriate laws of the State of Connecticuit and/or a
                                maritime lien pursuant to Title 46 of the United States Code or under general maritime law against the vessel and
                                its appurtenances securing any amount due to Marina in connection with the Boat or this Agreement. Owner
                                agrees that Marina may take and/or keep possession of the Boat at the Owner's and Boat's expense until
                                payment in full of all amounts due to the Marina has been made.</p>

                            <p>
                                <strong>8. EMERGENCIES.</strong>
                                Owner acknowledges that Marina has no duty or obligation to keep Boat afloat, to prevent
                                damage to the Boat, or to prevent the Boat from damaging the environment or the property of others. Owner
                                agrees that Marina may board and operate the Boat if, at any time, in the sole judgment of Marina this becomes
                                necessary to protect persons, the environment, or property. Marina may disconnect electrical power to the Boat
                                and/or disconnect and remove any electrical apparatus aboard the Boat that Marina considers in its sole
                                judgment to be unsafe, unlawful, or a nuisance. Nothing contained herein shall impose any duty upon Marina to
                                inspect the Boat or its equipment, to ensure the Boat's safety, or to determine if it is a danger to itself, the
                                environment, or to the persons and property of others. Ordinarily, Marina will first attempt to notify Owner
                                should it observe adverse conditions that do not place the Boat, the environment, or other property in imminent
                                peril. However, if the Boat should sink or appear in imminent danger of sinking, damage from high winds, waves,
                                tides, floods, fire, ice, or in need of dock lines, or if in the sole judgment of Marina the Boat constitutes an
                                imminent danger to itself, the environment, or other vessels/property, Marina in its sole discretion, may take
                                action itself or by hiring others, to haul, pump, raise, salvage, contain/cleanup oil/fuel spills, install dock lines,
                                move the vessel, tow it and store it elsewhere, or take such other action as Marina may deem appropriate,
                                without prior notification or further authorization from Owner. Under such circumstances, neither Marina, nor its
                                agents, employees, officers, directors, or representatives shall be responsible for any costs, losses, or damages
                                to the Boat or to other property of Owner as the result of taking such measures. Owner agrees to pay
                                immediately all reasonable charges billed by Marina to Owner or billed to Owner by others retained by Marina in
                                connection with the same, including, but not limited to Owner's proportionate share of expenses incurred by
                                Marina or its contractors for the common protection of boats and property in the Marina.
                            </p>
                            <p>
                                <strong>9. UTILITIES.</strong>
                                From time to time the Marina may experience outages of its amenities that are out of Marina
                                control. This may include but is not limited to utilities, electricity, fresh water, cable tv, and Wi-Fi. Outages,
                                regardless of duration do not entitle the Owner to a refund.
                            </p>
                            <p>
                                <strong>10. CASUALTY LOSS.</strong>
                                Owner shall immediately notify Marina of any fire or other casualty on, in, or about the Slip or
                                which involves the Boat. In the event the Slip or the pier/docks serving it are damaged by fire or other peril,
                                Marina shall have no obligation to repair or rebuild; however, Marina may elect to repair or rebuild, and in that
                                event, this Agreement shall remain in full force and effect, and Owner shall not be entitled to abatement of rent
                                while those repairs are being made as long as a substitute mooring is provided for the Boat within the Marina. If
                                Marina does not elect to rebuild or repair, then it may terminate this Agreement by giving notice of such election
                                to Owner within 60 days after damage occurs. Owner waives any claim for compensation or damages from
                                Marina for loss of the use of all or any of the Slip, the Boat, or other personal property, or any inconvenience or
                                annoyance occasioned by any such damage or from damage repairs.
                            </p>
                            <p>
                                <strong>11. HEADINGS, SEVERABILITY, GENDER, TIME, ENTIRE AGREEMENT.</strong>
                                The paragraph headings are for reference
                                only and are not a part of this Agreement. Marina agrees that the waiver of any term or condition of this
                                Agreement by Marina shall not be continuing. In the event that one or more terms of this Agreement are
                                determined to be unenforceable, such determination shall not affect the enforceability of the remainder of this
                                Agreement, which shall continue in full force and effect. This is the sole Agreement between the parties with
                                respect to the subject matter hereof, and all prior agreements, written and oral, are merged herein. No
                                modification hereof shall be binding unless in writing signed by both parties. The parties to this Agreement
                                mutually agree that it shall be binding upon them, and their respective heirs, personal representatives,
                                successors, and assigns. Owner agrees that the waiver of any term or condition of this Agreement by Marina
                                shall not constitute a waiver of any other term or condition of this Agreement and shall not be continuing. Rights
                                and remedies afforded to Marina under this Agreement are not exclusive but are in addition to all other rights
                                and remedies available to Marina at law, in equity or in admiralty. If Owner is a corporation, partnership, trust,
                                society, or legal entity, the person executing this Agreement on behalf of Owner warrants that he/she is
                                authorized to enter into this Agreement and to bind the Owner. Except as otherwise expressly provided in this
                                Agreement, time is of the essence.
                            </p>
                            <p>
                                <strong>12. CHOICE OF LAW/VENUE.</strong>
                                This Agreement is deemed to have been made and entered into in the State
                                of Connecticuit and shall be governed and interpreted by the laws of the State of Connecticuit, including federal
                                maritime law where applicable. Any legal action brought to enforce this Agreement must be filed in the
                                appropriate State court located in the County where the Marina is located, or in the United States District Court
                                for the District of Connecticuit, except that an in a proceeding against the Boat may be brought in the U.S.
                                District Court for the district where the Boat may be found. Owner and Marina agree to submit to the personal
                                jurisdiction and venue of said courts.
                            </p>
                            <p>
                                <strong>13. NOTICES.</strong>
                                Unless otherwise stated herein, any notice or demand that may be given or made hereunder shall be
                                properly made if in writing and sent by certified U.S. mail, postage prepaid, return receipt requested. If sent to
                                Marina, such notice shall be sent to Noank Shipyard, 145 Pearl Street, Noank, Ct 06340.. If sent to Owner, such
                                notice shall be sent to the named Owner at the address(es) given on the first page of this Agreement. All notices
                                hereunder shall be considered to have been properly given at the time they are deposited in any letter box or
                                post office operated by the United States Postal Service, and to have been received three days after being so
                                deposited.
                            </p>
                            <p>
                                <strong>14. SLIP SIZE.</strong>
                                No part or attachment may be protruding past the end of the outermost piling of the slip or over the
                                main dock. If Owner's boat is found to be longer than the assigned slip, MARINA reserves the right to require
                                that the boat be relocated to a larger slip at the increased rate for the term of this agreement, or charge for the
                                overhang in the existing slip. The length over all (LOA) must include the anchor, pulpits, davits, swim platforms,
                                etc.
                            </p>

                            <p>If you choose to pay by cash or check, print this contract and return.</p>
                            <p>&nbsp;</p>
                            <p>Please sign here____________________________________________    &nbsp;&nbsp; Date _____________________  </p>
                        </section>
                        <section className='invoice-details'>
                            <div className='invoice-first-child'>
                                <h2>Customer Signature:</h2>
                            </div>
                            <div className='invoice-second-child'>
                                <h2>Date:</h2>
                            </div>
                        </section>
                        <section className=''>
                            <h2>Terms Digitally Accepted</h2>
                            <p>The terms and conditions of this reservation were accepted online at the date and time listed below. The device used and IP address of that
device are also displayed. The time of acceptance is displayed in the marina's local time zone and the offset from the Universal Time Zone is
displayed for convenience.</p>
                        </section>

                    </div>
        </>
    );
};

export default ContractPreviewIndoorStorage;
